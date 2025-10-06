import express from "express";
import path from "path";
import { createServer } from "http";
import { fileURLToPath } from "url";

import usersRouter from "./server/routes/users.routes.js";
import { initSocketInstance } from "./server/services/socket.service.js";

// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5050;

const app = express();
const httpServer = createServer(app);

// Middlewares
app.use(express.json());
app.use("/app1", express.static(path.join(__dirname, "app1")));
app.use("/app2", express.static(path.join(__dirname, "app2")));

// Routes
app.use("/", usersRouter);

// Services
initSocketInstance(httpServer);

httpServer.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);