// server/index.js
import express from "express";
import statusRoute from "./routes/status.js"; // مسیر فایل status

const app = express();
const PORT = process.env.PORT || 4000;

// برای خواندن JSON از درخواست‌ها (فعلاً ساده)
app.use(express.json());

// مسیر اصلی API‌ها
app.use("/api/status", statusRoute);

// تست پایه
app.get("/", (req, res) => {
  res.send("🌀 Loopa Server API is running...");
});

// شروع سرور
app.listen(PORT, () => {
  console.log(`✅ Loopa API running on port ${PORT}`);
});
