import React, { useState } from 'react';
import {Button, Container, TextField, Typography} from "@mui/material";

interface WelcomeScreenProps {
    onEmailSubmit: (email: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEmailSubmit }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            const lowerCaseEmail = email.toLowerCase();
            onEmailSubmit(lowerCaseEmail);
            sessionStorage.setItem('receiverEmail', lowerCaseEmail);
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Welcome to the Email App
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    variant="outlined"
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default WelcomeScreen;
