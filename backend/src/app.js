import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import uploadRoutes from "./routes/upload.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "./uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors({
    origin: "*",
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "Online",
        service: "Vishal Studios Backend",
        uptime: process.uptime()
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "Online",
        service: "Vishal Studios Backend API",
        uptime: process.uptime()
    });
});

app.use("/api", uploadRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, error: "Route not found" });
});

app.use(errorHandler);

export default app;
