// server/index.js
import express from "express";
import cors from "cors";               // �o. OOOU?U� UcU+
import statusRoute from "./routes/status.js";
import deployRoute from "./routes/deploy.js";
import xrarRoute from "./routes/xrar.js";
import authRoute from "./routes/auth.js";
import { authGuard } from "./middleware/authGuard.js";
import { ensureAuthStore } from "./config/authStore.js";

const app = express();
const PORT = process.env.PORT || 4000;

// U?O1OU,�?OO3OO�UO CORS O�O U?O�OU+O� O"O�U^U+U� O"O API O�O-O"O� UcU+U�
app.use(cors());                       // �o. OrO� OO�U^O�UO O"O�OUO O_O3O�O�O3UO OO� U.O�U^O�U_O�
app.use(express.json());

app.use("/api/auth", authRoute);

// O�O3O� U_OUOU�
app.get("/", (req, res) => {
  res.send("dYO? Loopa Server API is running...");
});

app.use(authGuard);

// U.O3UOO�U�OUO API
app.use("/api/status", statusRoute);
app.use("/api/deploy", deployRoute);
app.use("/api/xrar", xrarRoute);

// O'O�U^O1 O3O�U^O�
ensureAuthStore()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`�o. Loopa API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialise auth store:", error);
    process.exit(1);
  });
