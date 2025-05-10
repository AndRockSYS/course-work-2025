'use server';

import { createTrain, createWagon, searchTrains } from './queries';
import { database } from '@/utils/constants';

import { Train, WagonType } from '@/types/railway';

export async function addTrain(
    arrivalDate: Date,
    departureDate: Date,
    departureStation: string,
    arrivalStation: string
): Promise<number> {
    if (isNaN(arrivalDate.getTime()) || isNaN(departureDate.getTime()))
        throw new Error('Invalid date format for arrival or departure');

    if (departureStation.length > 45 || arrivalStation.length > 45)
        throw new Error('Station names exceed 45 characters');

    const [result] = await database.query(createTrain, [
        arrivalDate,
        departureDate,
        departureStation,
        arrivalStation,
    ]);

    return (result as any).insertId;
}

export async function addWagon(
    wagonNumber: number,
    wagonType: WagonType,
    seatsAmount: number,
    price: number,
    trainId: number
): Promise<number> {
    const [result] = await database.query(createWagon, [
        wagonNumber,
        wagonType,
        seatsAmount,
        price,
        trainId,
    ]);

    return (result as any).insertId;
}

export async function fetchSearchTrains(
    departureStation: string,
    arrivalStation: string,
    departureDate: Date
): Promise<Train[]> {
    const [rows] = await database.query(searchTrains, [
        departureStation,
        arrivalStation,
        departureDate,
    ]);

    return rows as Train[];
}
