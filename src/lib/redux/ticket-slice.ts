import { createSlice } from '@reduxjs/toolkit';

export const ticketSlice = createSlice({
    name: 'ticketBooking',
    initialState: {
        trainId: -1,
        wagonId: -1,
        seatNumber: 0,

        name: '',
        surname: '',
        email: '',
        phoneNumber: '+380',
        services: [] as number[],
    },
    reducers: {
        setTrainWagon(state, action) {
            const { trainId, wagonId } = action.payload;
            state.trainId = trainId;
            state.wagonId = wagonId;
        },
        removeTrainWagon(state) {
            state.trainId = -1;
            state.wagonId = -1;
        },
        setSeatNumber(state, action) {
            state.seatNumber = action.payload;
        },
        setPhone(state, action) {
            state.phoneNumber = action.payload;
        },
        setTextValue(state: any, action) {
            const { type, value } = action.payload;
            state[type] = value;
        },
        manangeService(state, action) {
            const { serviceId, checked } = action.payload;
            if (checked) state.services.push(serviceId);
            else state.services = state.services.filter((service) => service != serviceId);
        },
    },
});

export const {
    setTrainWagon,
    removeTrainWagon,
    setSeatNumber,
    setPhone,
    setTextValue,
    manangeService,
} = ticketSlice.actions;

export default ticketSlice.reducer;
