import express from "express";
import multer from "multer";
import { uploadMedia } from "../controllers/upload.js";
const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 25 * 1024 * 1024
    }
});

router.post("/cloudinary-upload", upload.single("file"), uploadMedia);

export default router;
