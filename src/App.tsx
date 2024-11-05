import React, {useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import WelcomeScreen from './components/WelcomeScreen';
import EmailList from './components/EmailList';

const App: React.FC = () => {
    const [receiverEmail, setReceiverEmail] = useState<string | null>(null);

    const handleEmailSubmit = (email: string) => {
        setReceiverEmail(email);
    };

    const handleBackToWelcome = () => {
        setReceiverEmail(null);
        sessionStorage.removeItem('receiverEmail');
    };

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('receiverEmail');
        if (storedEmail) {
            setReceiverEmail(storedEmail);
        }
    }, []);

    return (
        <Provider store={store}>
            <div>
                {!receiverEmail ? (
                    <WelcomeScreen onEmailSubmit={handleEmailSubmit} />
                ) : (
                    <EmailList
                        receiverEmail={receiverEmail}
                        onBack={handleBackToWelcome}
                    />
                )}
            </div>
        </Provider>
    );
};

export default App;
