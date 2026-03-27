import cloudinary, { getCloudinaryConfigState } from "../config/cloudinary.js";
import fs from "fs/promises";

const getOptimizedDeliveryUrl = (publicId, resourceType) => {
    const commonOptions = {
        secure: true,
        resource_type: resourceType,
        type: "upload",
    };

    if (resourceType === "video") {
        return cloudinary.url(publicId, {
            ...commonOptions,
            format: "mp4",
            transformation: [
                {
                    quality: "auto:good",
                    fetch_format: "auto",
                    crop: "limit",
                    width: 1600,
                },
            ],
        });
    }

    return cloudinary.url(publicId, {
        ...commonOptions,
        transformation: [
            {
                quality: "auto:good",
                fetch_format: "auto",
                crop: "limit",
                width: 2200,
            },
        ],
    });
};

export const uploadMedia = async (req, res, next) => {
    try {
        const { isConfigured, missingEnvVars } = getCloudinaryConfigState();

        if (!isConfigured) {
            return res.status(500).json({
                success: false,
                error: `Cloudinary env missing: ${missingEnvVars.join(", ")}`
            });
        }

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

        const optimizedUrl = getOptimizedDeliveryUrl(result.public_id, result.resource_type);

        console.log(`[Upload] Success: ${result.secure_url}`);

        return res.status(200).json({
            success: true,
            data: {
                url: optimizedUrl,
                optimized_url: optimizedUrl,
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
