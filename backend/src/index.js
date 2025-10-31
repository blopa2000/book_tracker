import express from "express";
import dotenv from "dotenv";
import path from "path";
import morgan from "morgan";
import history from "connect-history-api-fallback";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// settings
app.set("port", process.env.PORT || 5000);

// middleware
app.use(morgan("combined"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use("/api/books", bookRoutes);

app.use(history());
app.use(express.static(path.join(__dirname, "../frontend")));

app.listen(app.get("port"), () => {
  console.log("🚀 Servidor backend en puerto", app.get("port"));
});
