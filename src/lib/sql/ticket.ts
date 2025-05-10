'use server';

import { addTicketService, createClient, createTicket, createTransaction } from './queries';
import { database } from '@/utils/constants';

import { PaymentStatus, PaymentType, TicketStatus } from '@/types/railway';

export async function addClient(
    phoneNumber: string,
    name: string,
    surname: string,
    birthDate: Date,
    email: string
): Promise<number> {
    if (isNaN(birthDate.getTime())) throw new Error('Invalid date format for birth date');

    if (phoneNumber.length > 15 || name.length > 45 || surname.length > 45 || email.length > 45)
        throw new Error('Some of the fields exceed 45 characters');

    const [result] = await database.query(createClient, [
        phoneNumber,
        name,
        surname,
        birthDate,
        email,
    ]);

    return (result as any).insertId;
}

export async function addTicket(
    phoneNumber: string,
    trainId: number,
    wagonId: number,
    seatNumber: number,
    status: TicketStatus
): Promise<number> {
    if (phoneNumber.length > 15) throw new Error('Phone number is too long');

    const [result] = await database.query(createTicket, [
        phoneNumber,
        trainId,
        wagonId,
        seatNumber,
        status,
    ]);

    return (result as any).insertId;
}

export async function addService(ticketId: number, serviceId: number) {
    const [result] = await database.query(addTicketService, [ticketId, serviceId]);
    return (result as any).insertId;
}

export async function addTransaction(
    value: number,
    paymentType: PaymentType,
    paymentStatus: PaymentStatus,
    ticketId: number
): Promise<number> {
    const paymentDate = new Date(Date.now());

    const [result] = await database.query(createTransaction, [
        value,
        paymentType,
        paymentStatus,
        paymentDate,
        ticketId,
    ]);

    return (result as any).insertId;
}
