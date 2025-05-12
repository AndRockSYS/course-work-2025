'use server';

import {
    createTrain,
    createWagon,
    getDepartureStations,
    getDestinationStations,
    selectWagons,
} from './queries';
import { database } from '@/utils/constants';

import { WagonType } from '@/types/railway';
import { SearchedWagon } from '@/types/query';

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

export async function fetchSearchedWagons(
    departureStation: string,
    arrivalStation: string,
    departureDate: Date
): Promise<SearchedWagon[]> {
    const [rows] = await database.query(selectWagons, [
        departureStation,
        arrivalStation,
        departureDate.toISOString().split('T')[0],
    ]);

    return rows as SearchedWagon[];
}

export async function fetchStations(): Promise<string[][]> {
    const [from]: any = await database.query(getDepartureStations);
    const [to]: any = await database.query(getDestinationStations);

    return [
        from.map((obj: any) => obj.departureStation),
        to.map((obj: any) => obj.arrivalStation),
    ] as any;
}
