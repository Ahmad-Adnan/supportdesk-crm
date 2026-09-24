import prisma from "./prisma.js";

export const createNote = async (ticketId, noteText) => {
    const ticket = await prisma.ticket.findUnique({
        where: {
            ticketId,
        },
    });

    if (!ticket) {
        return null;
    }

    const note = await prisma.note.create({
        data: {
            ticketId: ticket.id,
            noteText,
        },
        select: {
            id: true,
            ticketId: true,
            noteText: true,
            createdAt: true,
        },
    });

    return note;
};

export const getNotesByTicketId = async (ticketId) => {
    const ticket = await prisma.ticket.findUnique({
        where: {
            ticketId,
        },
    });

    if (!ticket) {
        return null;
    }

    const notes = await prisma.note.findMany({
        where: {
            ticketId: ticket.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            ticketId: true,
            noteText: true,
            createdAt: true,
        },
    });

    return notes;
};