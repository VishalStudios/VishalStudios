import express from "express";
import multer from "multer";
import {
    createUploadSignature,
    getCloudinaryAssetsMetadata,
    getCloudinaryStorageUsage,
    uploadMedia,
} from "../controllers/upload.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 25 * 1024 * 1024
    }
});

router.options("/cloudinary-upload", (req, res) => {
    res.sendStatus(204);
});

router.options("/cloudinary-signature", (req, res) => {
    res.sendStatus(204);
});

router.options("/cloudinary-storage", (req, res) => {
    res.sendStatus(204);
});

router.options("/cloudinary-assets-metadata", (req, res) => {
    res.sendStatus(204);
});

router.post("/cloudinary-signature", express.json(), createUploadSignature);
router.get("/cloudinary-storage", getCloudinaryStorageUsage);
router.post("/cloudinary-assets-metadata", express.json(), getCloudinaryAssetsMetadata);
router.post("/cloudinary-upload", upload.single("file"), uploadMedia);

export default router;
