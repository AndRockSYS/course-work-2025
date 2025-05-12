import { Train, Wagon } from './railway';

export interface SearchedTrain extends Train {
    startingPrice: number;
}

export interface SearchedTrainWagon extends Wagon {
    freeSeats: number;
}
