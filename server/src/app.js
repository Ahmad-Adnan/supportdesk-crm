import express from "express";
import cors from "cors";

import ticketRoutes from "./routes/ticketRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SupportDesk CRM API is running",
  });
});

app.use("/api/tickets", ticketRoutes);
app.use("/api/tickets", noteRoutes);

export default app;