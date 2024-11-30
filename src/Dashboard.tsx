import React, { useState } from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const isAuthenticated = useIsAuthenticated();
    const { accounts } = useMsal();
    const [copied, setCopied] = useState(false);

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    const idToken = accounts[0]?.idTokenClaims?.id_token as string || '';

    const handleCopy = () => {
        navigator.clipboard.writeText(idToken).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard!</p>
            <div>
                <textarea value={idToken} readOnly rows={10} cols={50} />
                <button onClick={handleCopy}>
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
            </div>
        </div>
    );
};

export default Dashboard;