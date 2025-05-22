'use server';

import {
    createStation,
    createTrain,
    createWagon,
    getAllActiveTrains,
    getAllStations,
    getStationByName,
    getTotalSalesByTrainId,
    selectFreeSeatsNumberForWagon,
    selectTrainById,
    selectTrains,
    selectWagonsForTrain,
} from './queries';
import { database } from '@/utils/constants';

import { Station, Train, WagonType } from '@/types/railway';
import { SearchedTrain, SearchedTrainWagon } from '@/types/query';

export async function getOrAddStation(name: string): Promise<number> {
    const [station]: any = await database.query(getStationByName, [name]);

    let stationId = station ? station[0].stationId : 0;

    if (!station) {
        const [result]: any = await database.query(createStation, [name]);
        stationId = result.insertId;
    }

    return stationId;
}

export async function addTrain(
    departureDate: Date,
    arrivalDate: Date,
    departureStationId: number,
    arrivalStationId: number
): Promise<number> {
    if (isNaN(arrivalDate.getTime()) || isNaN(departureDate.getTime()))
        throw new Error('Invalid date format for arrival or departure');

    const [result] = await database.query(createTrain, [
        arrivalDate,
        departureDate,
        departureStationId,
        arrivalStationId,
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

export async function fetchTrainById(trainId: number): Promise<Train> {
    const [rows]: any = await database.query(selectTrainById, [trainId]);
    return rows[0] as Train;
}

export async function fetchWagonByTrain(trainId: number): Promise<SearchedTrainWagon[]> {
    const [rows] = await database.query(selectWagonsForTrain, [trainId]);
    return rows as SearchedTrainWagon[];
}

export async function fetchFreeSeatsNumbers(wagonId: number): Promise<number[]> {
    const [rows]: any = await database.query(selectFreeSeatsNumberForWagon, [wagonId, wagonId]);
    return rows.map((obj: any) => obj.seatNumber).filter((seat: number) => seat > 0) as number[];
}

export async function fetchStations(): Promise<Station[]> {
    const [stations]: any = await database.query(getAllStations);
    return stations as Station[];
}

export async function fetchAllActiveTrains(): Promise<Train[]> {
    const [sales] = await database.query(getAllActiveTrains);
    return sales as Train[];
}

export async function fetchSalesByTrainId(trainId: number) {
    const [sales] = await database.query(getTotalSalesByTrainId, [trainId]);
    return sales;
}
