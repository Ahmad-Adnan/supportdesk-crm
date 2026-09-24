import prisma from "./prisma.js";

export const createTicket = async ({
    customerName,
    customerEmail,
    subject,
    description,
}) => {
    // Find the latest ticket to generate the next ticket number
    const latestTicket = await prisma.ticket.findFirst({
        orderBy: {
            id: "desc",
        },
    });

    const nextNumber = latestTicket
        ? latestTicket.id + 1
        : 1;

    const ticketId = `TKT-${String(nextNumber).padStart(3, "0")}`;

    const ticket = await prisma.ticket.create({
        data: {
            ticketId,
            customerName,
            customerEmail,
            subject,
            description,
        },
        select: {
            ticketId: true,
            createdAt: true,
        },
    });

    return ticket;
};
export const getTickets = async ({ status, search }) => {
    const where = {};

    // Filter by ticket status
    if (status) {
        where.status = status;
    }

    // Search across ticket ID, customer name, email, and description
    if (search) {
        where.OR = [
            {
                ticketId: {
                    contains: search,
                },
            },
            {
                customerName: {
                    contains: search,
                },
            },
            {
                customerEmail: {
                    contains: search,
                },
            },
            {
                subject: {
                    contains: search,
                },
            },
            {
                description: {
                    contains: search,
                },
            },
        ];
    }

    const tickets = await prisma.ticket.findMany({
        where,
        orderBy: {
            createdAt: "desc",
        },
        select: {
            ticketId: true,
            customerName: true,
            subject: true,
            status: true,
            createdAt: true,
        },
    });

    return tickets;
};
export const getTicketById = async (ticketId) => {
    const ticket = await prisma.ticket.findUnique({
        where: {
            ticketId,
        },
        select: {
            ticketId: true,
            customerName: true,
            customerEmail: true,
            subject: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return ticket;
};
export const updateTicketStatus = async (ticketId, status) => {
    const ticket = await prisma.ticket.findUnique({
        where: {
            ticketId,
        },
    });

    if (!ticket) {
        return null;
    }

    const updatedTicket = await prisma.ticket.update({
        where: {
            ticketId,
        },
        data: {
            status,
        },
        select: {
            ticketId: true,
            customerName: true,
            customerEmail: true,
            subject: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return updatedTicket;
};
export const deleteTicket = async (ticketId) => {
    const ticket = await prisma.ticket.findUnique({
        where: {
            ticketId,
        },
    });

    if (!ticket) {
        return null;
    }

    await prisma.ticket.delete({
        where: {
            ticketId,
        },
    });

    return ticket;
};