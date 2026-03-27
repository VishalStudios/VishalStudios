import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const getCloudinaryConfigState = () => {
    const requiredEnvVars = [
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
    ];

    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]?.trim());

    return {
        isConfigured: missingEnvVars.length === 0,
        missingEnvVars,
    };
};

const { isConfigured, missingEnvVars } = getCloudinaryConfigState();

if (!isConfigured) {
    console.error("[Cloudinary Config] Missing environment variables:", missingEnvVars.join(", "));
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
