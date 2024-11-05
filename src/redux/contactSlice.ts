import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContactsState {
    contacts: string[];
}

const initialState: ContactsState = {
    contacts: ['bob@example.com', 'alice@example.com'],
};

const contactsSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
        addContact(state, action: PayloadAction<string>) {
            state.contacts.push(action.payload);
        },
    },
});

export const { addContact } = contactsSlice.actions;

export default contactsSlice.reducer;
