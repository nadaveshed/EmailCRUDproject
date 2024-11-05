import {
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import './EmailForm.css';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createEmail } from '../redux/emailSlice';
import { AppDispatch } from '../redux/store';

interface EmailFormProps {
    receiverEmail: string;
    onClose: () => void;
    contacts: string[];
    onEmailSent: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ receiverEmail, onClose, contacts, onEmailSent }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [senderEmail, setSenderEmail] = useState( '');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setAttachments(Array.from(files));
        }
    };

    const handleRecipientChange = (event: SelectChangeEvent) => {
        const receiver_email = event.target.value;
        setSenderEmail(receiver_email);
    };

    const handleSenderEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSenderEmail(event.target.value.toLowerCase());
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        const formData = new FormData();
        formData.append('sender_email', receiverEmail);
        formData.append('receiver_email', senderEmail);
        formData.append('subject', subject);
        formData.append('body', body);

        attachments.forEach((file) => {
            formData.append('attachments', file);
        });

        try {
            await dispatch(createEmail(formData));
            onEmailSent();
            onClose();
        } catch (error) {
            setError((error as any).message || 'Failed to send email');
        }
    };

    return (
        <Container style={{ maxWidth: '600px', padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Compose Email
            </Typography>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>

                <TextField
                    label="To"
                    type="email"
                    value={senderEmail}
                    onChange={handleSenderEmailChange}
                    required
                    variant="outlined"
                    margin="normal"
                />

                <FormControl variant="outlined" fullWidth margin="normal">
                    <InputLabel htmlFor="recipient">Recipient</InputLabel>
                    <Select
                        id="recipient"
                        value=""
                        onChange={handleRecipientChange}
                        label="Recipient"
                    >
                        <MenuItem value="" disabled>
                            Choose from your contacts (optional)
                        </MenuItem>
                        {contacts.map((contact, index) => (
                            <MenuItem key={index} value={contact}>
                                {contact}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    variant="outlined"
                    margin="normal"
                />

                <TextField
                    label="Body"
                    multiline
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    variant="outlined"
                    margin="normal"
                />

                <div className="file-input">
                    <label>Attachments:</label>
                    <input type="file" multiple onChange={handleFileChange}/>
                </div>

                <div className="form-btn-div">
                    <Button type="submit" variant="contained" color="primary" style={{marginTop: '16px'}}>
                        Send Email
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={onClose} style={{marginTop: '16px'}}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Container>
    );
};

export default EmailForm;
