import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

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
