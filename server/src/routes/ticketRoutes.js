import express from "express";

import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket,
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", createTicket);

router.get("/", getTickets);

router.get("/:ticketId", getTicketById);

router.patch("/:ticketId", updateTicketStatus);

router.delete("/:ticketId", deleteTicket);

export default router;