import { createSlice } from '@reduxjs/toolkit';

import { WagonType } from '@/types/railway';

interface WagonToAdd {
    wagonNumber: number;
    wagonType: WagonType;
    seatsAmount: number;
    price: number;
}

export const trainSlice = createSlice({
    name: 'trainCreation',
    initialState: {
        departureDate: '',
        arrivalDate: '',
        departureStation: '',
        arrivalStation: '',
        wagons: [] as WagonToAdd[],
    },
    reducers: {
        setDeparture(state, action) {
            const { date, station } = action.payload;
            if (date) state.departureDate = date;
            if (station) state.departureStation = station;
        },
        setArrival(state, action) {
            const { date, station } = action.payload;
            if (date) state.arrivalDate = date;
            if (station) state.arrivalStation = station;
        },
        updateWagon(state, action) {
            state.wagons = state.wagons.map((wagon) => {
                if (action.payload.wagonNumber == wagon.wagonNumber)
                    return { ...wagon, ...action.payload };
                return wagon;
            });
        },
        addEmptyWagon(state) {
            const empty = {
                wagonNumber: state.wagons.length + 1,
                wagonType: 'Плацкарт' as WagonType,
                seatsAmount: 0,
                price: 0,
            };
            state.wagons.push(empty);
        },
        removeLastWagon(state) {
            state.wagons.pop();
        },
    },
});

export const { setDeparture, setArrival, addEmptyWagon, updateWagon, removeLastWagon } =
    trainSlice.actions;

const initial = trainSlice.getInitialState();
export type TrainCreation = typeof initial;

export default trainSlice.reducer;
