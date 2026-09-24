import {
  createNote as createNoteService,
  getNotesByTicketId as getNotesByTicketIdService,
} from "../services/noteService.js";

export const createNote = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { noteText } = req.body;

    if (!noteText || !noteText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note text is required.",
      });
    }

    const note = await createNoteService(
      ticketId,
      noteText.trim()
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    return res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const getNotesByTicketId = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const notes = await getNotesByTicketIdService(ticketId);

    if (notes === null) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    return res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};