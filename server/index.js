// server/index.js
import express from "express";
import cors from "cors";               // ✅ اضافه کن
import statusRoute from "./routes/status.js";
import deployRoute from "./routes/deploy.js";

const app = express();
const PORT = process.env.PORT || 4000;

// فعال‌سازی CORS تا فرانت بتونه با API صحبت کنه
app.use(cors());                       // ✅ خط ضروری برای دسترسی از مرورگر
app.use(express.json());

// مسیرهای API
app.use("/api/status", statusRoute);
app.use("/api/deploy", deployRoute);

// تست پایه
app.get("/", (req, res) => {
  res.send("🌀 Loopa Server API is running...");
});

// شروع سرور
app.listen(PORT, () => {
  console.log(`✅ Loopa API running on port ${PORT}`);
});
