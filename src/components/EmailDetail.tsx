import React from 'react';
import { useDispatch } from 'react-redux';
import { downloadAttachment } from '../redux/emailSlice';
import {Button, Typography, List, ListItem} from '@mui/material';
import { AppDispatch } from '../redux/store';

interface EmailDetailProps {
    email: {
        sender_email: string;
        receiver_email: string;
        subject: string;
        body: string;
        date_sent: string;
        attachments: string[] | null;
    };
    onClose: () => void;
}

const EmailDetail: React.FC<EmailDetailProps> = ({ email, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleDownload = (filename: string) => {
        dispatch(downloadAttachment(filename));
    };

    const attachments = email.attachments
        ? email.attachments.flatMap(attachment => attachment.split(','))
        : [];

    console.log('Attachments:', attachments);

    return (
        <div style={{padding: '16px'}}>
            <Typography variant="h5" align="center" gutterBottom>
                {email.subject}
            </Typography>
            <Typography variant="body1">From: {email.sender_email}</Typography>
            <Typography variant="body1">To: {email.receiver_email}</Typography>
            <Typography variant="body1">Date: {new Date(email.date_sent).toLocaleString()}</Typography>
            <Typography variant="body2" display="block" style={{background: '#f0f0f0', padding: '8px'}}>
                {email.body}
            </Typography>
            {attachments.length > 0 ? (
                <div>
                    <Typography variant="subtitle2" style={{fontSize: '0.875rem', marginBottom: '8px'}}>
                        Attachments:
                    </Typography>
                    <List>
                        {attachments.map((attachment, index) => (
                            <ListItem key={index} style={{padding: '0'}}>
                                <Typography variant="body2" style={{marginRight: '8px'}}>
                                    {attachment.split('\\').pop()}
                                </Typography>
                                <Button variant="outlined" size="small" onClick={() => handleDownload(attachment)}>
                                    Download
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </div>
            ) : (
                <Typography style={{fontSize: '12px'}}>No attachments available.</Typography>
            )}
            <Button variant="outlined" onClick={onClose} style={{marginTop: '16px'}}>
                Close
            </Button>
        </div>
    );
};

export default EmailDetail;
