import { Wagon } from './railway';

export interface SearchedWagon extends Wagon {
    departureDate: Date;
    arrivalDate: Date;
}
