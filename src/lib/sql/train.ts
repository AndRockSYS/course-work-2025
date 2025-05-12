'use server';

import {
    createTrain,
    createWagon,
    getDepartureStations,
    getDestinationStations,
    selectFreeSeatsNumberForWagon,
    selectTrains,
    selectWagonsForTrain,
} from './queries';
import { database } from '@/utils/constants';

import { WagonType } from '@/types/railway';
import { SearchedTrain, SearchedTrainWagon } from '@/types/query';

export async function addTrain(
    departureDate: Date,
    arrivalDate: Date,
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

export async function fetchedSearchedTrains(
    departureStation: string,
    arrivalStation: string,
    departureDate: Date
): Promise<SearchedTrain[]> {
    const [rows] = await database.query(selectTrains, [
        departureStation,
        arrivalStation,
        departureDate.toISOString().split('T')[0],
    ]);

    return rows as SearchedTrain[];
}

export async function fetchWagonByTrain(trainId: number): Promise<SearchedTrainWagon[]> {
    const [rows] = await database.query(selectWagonsForTrain, [trainId]);
    return rows as SearchedTrainWagon[];
}

export async function fetchFreeSeatsNumbers(wagonId: number): Promise<number[]> {
    const [rows]: any = await database.query(selectFreeSeatsNumberForWagon, [wagonId, wagonId]);
    return rows.map((obj: any) => obj.seatNumber) as number[];
}

export async function fetchStations(): Promise<string[][]> {
    const [from]: any = await database.query(getDepartureStations);
    const [to]: any = await database.query(getDestinationStations);

    return [
        from.map((obj: any) => obj.departureStation),
        to.map((obj: any) => obj.arrivalStation),
    ] as any;
}
