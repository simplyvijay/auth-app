import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {PublicClientApplication, Configuration, RedirectRequest} from '@azure/msal-browser';
import {MsalProvider} from '@azure/msal-react';
import React, {useState} from 'react';
import './App.css';
import Dashboard from './Dashboard';

type Environment = 'DEV' | 'QA' | 'PROD';

const environments: Record<Environment, { clientId: string; tenantId: string }> = {
    DEV: {
        clientId: 'your-dev-client-id',
        tenantId: 'your-dev-tenant-id',
    },
    QA: {
        clientId: 'your-qa-client-id',
        tenantId: 'your-qa-tenant-id',
    },
    PROD: {
        clientId: 'your-prod-client-id',
        tenantId: 'your-prod-tenant-id',
    },
};

function App() {
    const [environment, setEnvironment] = useState<Environment>('DEV');

    const handleEnvironmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setEnvironment(event.target.value as Environment);
    };

    const getMsalConfig = (environment: Environment): Configuration => {
        const selectedEnv = environments[environment];
        return {
            auth: {
                clientId: selectedEnv.clientId,
                authority: `https://login.microsoftonline.com/${selectedEnv.tenantId}`,
                redirectUri: 'http://localhost:5173/dashboard',
            },
        };
    };

    const handleLogin = () => {
        const msalConfig = getMsalConfig(environment);
        const msalInstance = new PublicClientApplication(msalConfig);
        const loginRequest: RedirectRequest = {
            scopes: ['user.read'],
        };

        msalInstance.loginRedirect(loginRequest).catch(e => {
            console.error(e);
        });
    };

    return (
        <MsalProvider instance={new PublicClientApplication(getMsalConfig(environment))}>
            <Router>
                <h1>WAV Modernization</h1>
                <div className="card">
                    <select value={environment} onChange={handleEnvironmentChange}>
                        <option value="DEV">DEV</option>
                        <option value="QA">QA</option>
                        <option value="PROD">PROD</option>
                    </select>
                    <button onClick={handleLogin}>
                        Login
                    </button>
                </div>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                </Routes>
            </Router>
        </MsalProvider>
    );
}

export default App;