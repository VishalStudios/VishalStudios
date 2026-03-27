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
