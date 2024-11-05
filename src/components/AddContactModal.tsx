import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addContact } from '../redux/contactSlice';
import { AppDispatch } from '../redux/store';
import Modal from './Modal';
import './AddContactModal.css';

interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose }) => {
    const dispatch: AppDispatch = useDispatch();
    const [newContact, setNewContact] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newContact) {
            setError('Contact email is required.');
            return;
        }
        dispatch(addContact(newContact));
        setNewContact('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="add-contact-modal">
                <h2>Add Contact</h2>
                <form onSubmit={handleSubmit} className="add-contact-form">
                    <div className="form-group">
                        <label>Contact Email:</label>
                        <input
                            type="email"
                            value={newContact}
                            onChange={(e) => setNewContact(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <div className="form-buttons">
                        <button type="submit" className="add-contact-btn primary">Add Contact</button>
                        <button type="button" onClick={onClose} className="add-contact-btn secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};


export default AddContactModal;
