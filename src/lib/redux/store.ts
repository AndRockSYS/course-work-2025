import { configureStore } from '@reduxjs/toolkit';

import ticketReducer from './ticket-slice';

export const makeStore = () => {
    return configureStore({
        reducer: { ticketReducer },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
