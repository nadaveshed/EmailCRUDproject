import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './emailSlice';
import contactReducer from "./contactSlice";

export const store = configureStore({
    reducer: {
        emails: emailReducer,
        contacts: contactReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['emails/downloadAttachment/fulfilled'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store;
