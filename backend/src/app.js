import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

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
        service: "Vishal Photography Backend",
        uptime: process.uptime()
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "Online",
        service: "Vishal Photography Backend API",
        uptime: process.uptime()
    });
});

app.use("/api", uploadRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, error: "Route not found" });
});

app.use(errorHandler);

export default app;
