import cloudinary, { getCloudinaryConfigState } from "../config/cloudinary.js";
import fs from "fs/promises";

const getUploadConfigOrThrow = () => {
    const { isConfigured, missingEnvVars } = getCloudinaryConfigState();

    if (!isConfigured) {
        const error = new Error(`Cloudinary env missing: ${missingEnvVars.join(", ")}`);
        error.status = 500;
        throw error;
    }

    return {
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        folder: "vishal_studios",
    };
};

const parseCloudinaryPublicId = (assetUrl) => {
    if (!assetUrl) return null;

    try {
        const { pathname } = new URL(assetUrl);
        const uploadMatch = pathname.match(/\/(?:image|video|raw)\/upload\/(?:v\d+\/)?(.+)$/i);

        if (!uploadMatch?.[1]) {
            return null;
        }

        return uploadMatch[1].replace(/\.[^/.]+$/, "");
    } catch {
        return null;
    }
};

const normalizeStorageUsage = (usageResponse) => {
    const storageDetails = usageResponse?.storage || {};
    const usedBytes =
        storageDetails.usage ??
        storageDetails.used ??
        storageDetails.bytes ??
        usageResponse?.storage_usage ??
        0;
    const limitBytes =
        storageDetails.limit ??
        storageDetails.allowed ??
        usageResponse?.storage_limit ??
        null;

    return {
        usedBytes,
        limitBytes,
        remainingBytes: typeof limitBytes === "number" ? Math.max(limitBytes - usedBytes, 0) : null,
        usagePercent: typeof limitBytes === "number" && limitBytes > 0
            ? Number(((usedBytes / limitBytes) * 100).toFixed(2))
            : null,
        assets: usageResponse?.resources ?? usageResponse?.objects ?? null,
    };
};

const buildOptimizedDeliveryUrl = (assetUrl, resourceType = "image") => {
    const publicId = parseCloudinaryPublicId(assetUrl);

    if (!publicId) {
        return assetUrl;
    }

    const transformation =
        resourceType === "video"
            ? "f_auto,q_auto:good,vc_auto,br_1200k,w_1280"
            : "f_auto,q_auto:good,w_1600";

    return cloudinary.url(publicId, {
        resource_type: resourceType,
        secure: true,
        transformation,
        type: "upload",
    });
};

const getRemoteFileSize = async (assetUrl) => {
    if (!assetUrl) return null;

    try {
        const response = await fetch(assetUrl, {
            method: "HEAD",
        });

        if (!response.ok) {
            return null;
        }

        const contentLength = response.headers.get("content-length");
        return contentLength ? Number(contentLength) : null;
    } catch {
        return null;
    }
};

export const createUploadSignature = async (req, res, next) => {
    try {
        const { apiKey, cloudName, folder } = getUploadConfigOrThrow();
        const timestamp = Math.floor(Date.now() / 1000);
        const resourceType = req.body?.resource_type === "video" ? "video" : "image";

        const paramsToSign = {
            folder,
            timestamp,
            use_filename: true,
            unique_filename: true,
        };

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET
        );

        return res.status(200).json({
            success: true,
            data: {
                apiKey,
                cloudName,
                folder,
                resourceType,
                signature,
                timestamp,
                use_filename: true,
                unique_filename: true,
            },
        });
    } catch (error) {
        return next(error);
    }
};

export const getCloudinaryStorageUsage = async (req, res, next) => {
    try {
        getUploadConfigOrThrow();

        const usageResponse = await cloudinary.api.usage();
        const normalizedUsage = normalizeStorageUsage(usageResponse);

        return res.status(200).json({
            success: true,
            data: normalizedUsage,
        });
    } catch (error) {
        return next(error);
    }
};

export const getCloudinaryAssetsMetadata = async (req, res, next) => {
    try {
        getUploadConfigOrThrow();

        const assets = Array.isArray(req.body?.assets) ? req.body.assets.slice(0, 100) : [];

        if (assets.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Assets list required hai.",
            });
        }

        const results = await Promise.all(
            assets.map(async (asset) => {
                const resourceType = asset?.resource_type === "video" ? "video" : "image";
                const publicId = parseCloudinaryPublicId(asset?.url);

                if (!publicId) {
                    return {
                        url: asset?.url,
                        error: "Invalid Cloudinary URL",
                    };
                }

                try {
                    const resource = await cloudinary.api.resource(publicId, {
                        resource_type: resourceType,
                        type: "upload",
                    });
                    const optimizedUrl = buildOptimizedDeliveryUrl(asset.url, resourceType);
                    const optimizedBytes = await getRemoteFileSize(optimizedUrl);

                    return {
                        url: asset.url,
                        bytes: resource.bytes ?? null,
                        duration: resource.duration ?? null,
                        format: resource.format ?? null,
                        height: resource.height ?? null,
                        optimizedBytes,
                        optimizedUrl,
                        publicId,
                        resourceType,
                        width: resource.width ?? null,
                    };
                } catch (resourceError) {
                    return {
                        url: asset?.url,
                        error: resourceError?.message || "Metadata fetch failed",
                    };
                }
            })
        );

        return res.status(200).json({
            success: true,
            data: results,
        });
    } catch (error) {
        return next(error);
    }
};

export const uploadMedia = async (req, res, next) => {
    try {
        getUploadConfigOrThrow();

        if (!req.file?.buffer && !req.file?.path) {
            return res.status(400).json({
                success: false,
                error: "No file provided. Please attach a file to the request."
            });
        }

        console.log(`[Upload] Starting upload for: ${req.file.originalname}`);

        const { resource_type } = req.body;

        const options = {
            resource_type: resource_type || "auto",
            folder: "vishal_studios",
            use_filename: true,
            unique_filename: true,
        };

        const result = req.file.buffer
            ? await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(options, (error, uploadedResult) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(uploadedResult);
                });

                uploadStream.end(req.file.buffer);
            })
            : await cloudinary.uploader.upload(req.file.path, options);

        if (req.file.path) {
            await fs.unlink(req.file.path).catch(() => {});
        }

        console.log(`[Upload] Success: ${result.secure_url}`);

        return res.status(200).json({
            success: true,
            data: {
                url: result.secure_url,
                original_url: result.secure_url,
                public_id: result.public_id,
                resource_type: result.resource_type,
                bytes: result.bytes,
                format: result.format
            }
        });

    } catch (error) {
        console.error(`[Upload Service Error]`, error);
        return next(error);
    }
};
