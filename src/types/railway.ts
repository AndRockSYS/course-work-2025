export type TicketStatus = 'Активний' | 'Повернуто';

export interface Ticket {
    ticketId: number;
    clientId: number;
    trainId: number;
    wagonId: number;
    seatNumber: number;
    status: TicketStatus;
}

export interface Client {
    phoneNumber: string;
    name: string;
    surname: string;
    birthDate: Date;
    email: string;
}

export interface AdditionalService {
    serviceId: number;
    serviceName: string;
    price: number;
}

export type PaymentStatus = 'success' | 'pending' | 'fail';

export type PaymentType = 'Google Pay' | 'Apple Pay' | 'Bank Transfer';

export interface Transaction {
    transactionId: number;
    value: number;
    paymentType: PaymentType;
    paymentStatus: PaymentStatus;
    paymentDate: Date;
    ticketId: number;
}

export interface Train {
    trainId: number;
    departureDate: Date;
    arrivalDate: Date;
    departureStation: string;
    arrivalStation: string;
}

export type WagonType = 'Плацкарт' | 'Купе' | 'Люкс';

export interface Wagon {
    wagonId: number;
    trainId: number;
    wagonNumber: number;
    wagonType: WagonType;
    seatsAmount: number;
    price: number;
}
