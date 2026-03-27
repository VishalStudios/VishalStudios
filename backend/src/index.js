import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 5005;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`
    =========================================
    🚀 Backend Architecture Expert Status:
    
    SERVER: RUNNING
    PORT: ${PORT}
    ENVIRONMENT: ${process.env.NODE_ENV || 'production'}
    LOGS: ENABLED
    =========================================
    `);
});
