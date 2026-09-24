import express from "express";

import {
  createNote,
  getNotesByTicketId,
} from "../controllers/noteController.js";

const router = express.Router();

router.post("/:ticketId/notes", createNote);

router.get("/:ticketId/notes", getNotesByTicketId);

export default router;