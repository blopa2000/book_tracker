import dotenv from "dotenv";
import history from "connect-history-api-fallback";

import { connectDB } from "./config/db.js";
import app from "./app.js";

dotenv.config();
connectDB();

app.use(history());

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend en puerto ${PORT}`);
});
