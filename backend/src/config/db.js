import mongoose from "mongoose";

export const connectDB = async (uri = process.env.MONGO_URI) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (process.env.NODE_ENV !== "test") {
      console.log("✅ Conectado a MongoDB");
    }
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    // ❌ No usamos process.exit() porque rompe los tests
    throw error;
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
};
