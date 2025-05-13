'use server';

import { getAdditionalServices, createService, addTicketService } from './queries';
import { database } from '@/utils/constants';

import { AdditionalService } from '@/types/railway';

export async function fetchAdditionalServices(): Promise<AdditionalService[]> {
    const [rows] = await database.query(getAdditionalServices);
    return rows as AdditionalService[];
}

export async function addAdditionalService(serviceName: string, price: number): Promise<number> {
    const [result] = await database.query(createService, [serviceName, price]);
    return (result as any).insertId;
}

export async function addServiceForTicket(ticketId: string, serviceId: string) {
    await database.query(addTicketService, [ticketId, serviceId]);
}
