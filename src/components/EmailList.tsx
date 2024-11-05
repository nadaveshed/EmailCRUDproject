import React, {useEffect, useState} from 'react';
import {Email, fetchEmails} from '../redux/emailSlice';
import {AppDispatch, RootState} from '../redux/store';
import Modal from './Modal';
import EmailForm from './EmailForm';
import EmailDetail from './EmailDetail';
import AddContactModal from './AddContactModal';
import './EmailList.css';

import {useDispatch, useSelector} from 'react-redux';
import {Button, Typography, List, ListItem, ListItemText, Container} from '@mui/material';

const EmailList: React.FC<{ receiverEmail: string; onBack: () => void; }> = ({ receiverEmail, onBack }) => {
    const dispatch: AppDispatch = useDispatch();
    const emails = useSelector((state: RootState) => state.emails.list);
    const loading = useSelector((state: RootState) => state.emails.loading);
    const error = useSelector((state: RootState) => state.emails.error);
    const contacts = useSelector((state: RootState) => state.contacts.contacts);
    const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
    const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    useEffect(() => {
        if (receiverEmail) {
            dispatch(fetchEmails(receiverEmail));
        }
    }, [dispatch, receiverEmail]);

    const handleEmailClick = (email: Email) => {
        setSelectedEmail(email);
        setIsDetailsModalOpen(true);
    };

    const handleEmailSent = () => {
        if (receiverEmail) {
            dispatch(fetchEmails(receiverEmail));
        }
        setIsComposeModalOpen(false);
    };

    const sortedEmails = [...emails].sort((a, b) => new Date(b.date_sent).getTime() - new Date(a.date_sent).getTime());


    if (loading) {
        return <div>Loading...</div>;

    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            <Button variant="contained" className="back-button" onClick={onBack}>
                Logout
            </Button>
            <Typography variant="h4" align="center" gutterBottom>
                {receiverEmail} Email List
            </Typography>
            <div className="email-list-header-buttons-div">
                <Button variant="contained" color="secondary" onClick={() => setIsComposeModalOpen(true)}>
                    Compose Email
                </Button>
                <Button variant="contained" color="secondary" onClick={() => setIsAddContactModalOpen(true)}>
                    Add Contact
                </Button>
            </div>
            {sortedEmails.length === 0 ? (
                    <Typography variant="body1" align="center">No emails found.</Typography>
                ) : (
                <List>
                    {sortedEmails.map((email) => (
                        <ListItem
                            component="button"
                            key={email.id}
                            onClick={() => handleEmailClick(email)}
                        >
                            <ListItemText
                                primary={
                                    <>
                                        <strong>Subject:</strong> {email.subject}
                                    </>
                                }
                                secondary={
                                    <>
                                        <strong>From:</strong> {email.sender_email} <br />
                                        <strong>Body:</strong> {email.body}
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
                )}
            <Modal isOpen={isComposeModalOpen} onClose={() => setIsComposeModalOpen(false)}>
                <EmailForm
                    receiverEmail={receiverEmail}
                    onClose={() => setIsComposeModalOpen(false)}
                    contacts={contacts}
                    onEmailSent={handleEmailSent}
                />
            </Modal>

            <AddContactModal
                isOpen={isAddContactModalOpen}
                onClose={() => setIsAddContactModalOpen(false)}
            />

            {isDetailsModalOpen && selectedEmail && (
                <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}>
                    <EmailDetail email={selectedEmail} onClose={() => setIsDetailsModalOpen(false)} />
                </Modal>
            )}
        </Container>
    );
};

export default EmailList;
