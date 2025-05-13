import { configureStore } from '@reduxjs/toolkit';

import ticketReducer from './ticket-slice';
import trainReducer from './train-slice';

export const makeStore = () => {
    return configureStore({
        reducer: { ticketReducer, trainReducer },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
