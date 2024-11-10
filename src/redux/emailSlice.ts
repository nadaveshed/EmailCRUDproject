import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

export interface Email {
    id: number;
    subject: string;
    sender_email: string;
    body: string;
    receiver_email: string;
    attachments: string[] | null;
    date_sent: string;
}

interface EmailState {
    list: Email[];
    loading: boolean;
    error: string | null;
    receiverEmail: string | null;
}

const initialState: EmailState = {
    list: [],
    loading: false,
    error: null,
    receiverEmail: null,
};

const API_URL = 'http://localhost:8000';

export const fetchEmails = createAsyncThunk<Email[], string>(
    'emails/fetchEmails',
    async (receiverEmail) => {
        const response = await axios.get(`${API_URL}/emails?receiver_email=${receiverEmail}`);
        return response.data;
    }
);

export const createEmail = createAsyncThunk<Email, FormData>(
    'emails/createEmail',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/emails/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to send email');
        }
    }
);

export const downloadAttachment = createAsyncThunk<void, string, { rejectValue: string }>(
    'emails/downloadAttachment',
    async (filename: string, { rejectWithValue }) => {
        try {
            const cleanFilename = filename.replace(/^attachments[\\\/]/, '');

            const response = await fetch(`${API_URL}/download/attachments/${encodeURIComponent(cleanFilename)}`);
            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename.split('\\').pop()?.split('/').pop() ?? 'attachment';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
        }
    }
);

const emailSlice = createSlice({
    name: 'emails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmails.fulfilled, (state, action) => {
                state.list = action.payload;
                state.loading = false;
            })
            .addCase(fetchEmails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch emails';
            })
            .addCase(createEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.list.push(action.payload);
            })
            .addCase(createEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(downloadAttachment.fulfilled, () => {
            })
            .addCase(downloadAttachment.rejected, (state, action) => {
                state.loading = false;
                console.error('Download failed:', action.error.message);
            });
    },
});

export default emailSlice.reducer;
