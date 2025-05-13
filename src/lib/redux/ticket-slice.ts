import { createSlice } from '@reduxjs/toolkit';

import { PaymentType, Wagon } from '@/types/railway';

export const ticketSlice = createSlice({
    name: 'ticketBooking',
    initialState: {
        wagon: undefined as Wagon | undefined,
        seatNumber: -1,

        name: '',
        surname: '',
        email: '',
        phoneNumber: '+380',
        date: '',
        services: [] as number[],

        paymentMethod: 'Google Pay' as PaymentType,
    },
    reducers: {
        setTrainWagon(state, action) {
            state.wagon = action.payload;
        },
        removeTrainWagon(state) {
            state.wagon = undefined;
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
        setPaymentMethod(state, action) {
            state.paymentMethod = action.payload;
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
    setPaymentMethod,
} = ticketSlice.actions;

export default ticketSlice.reducer;
