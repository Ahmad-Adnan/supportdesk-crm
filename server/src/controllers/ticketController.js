import {
  createTicket as createTicketService,
  getTickets as getTicketsService,
  getTicketById as getTicketByIdService,
  updateTicketStatus as updateTicketStatusService,
  deleteTicket as deleteTicketService,
} from "../services/ticketService.js";

export const createTicket = async (req, res, next) => {
  try {
    const {
      customerName,
      customerEmail,
      subject,
      description,
    } = req.body;

    // Basic validation
    if (!customerName || !customerEmail || !subject || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Customer name, customer email, subject, and description are required.",
      });
    }

    const ticket = await createTicketService({
      customerName,
      customerEmail,
      subject,
      description,
    });

    return res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};
export const getTickets = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    const tickets = await getTicketsService({
      status,
      search,
    });

    return res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};
export const getTicketById = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const ticket = await getTicketByIdService(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["OPEN", "IN_PROGRESS", "CLOSED"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Status is required and must be OPEN, IN_PROGRESS, or CLOSED.",
      });
    }

    const ticket = await updateTicketStatusService(ticketId, status);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};
export const deleteTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const ticket = await deleteTicketService(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket deleted successfully.",
      ticketId: ticket.ticketId,
    });
  } catch (error) {
    next(error);
  }
};