import React, {useEffect, useState} from "react";
import { PublicClientApplication, AuthenticationResult, SilentRequest, Configuration } from "@azure/msal-browser";
import { Box, Button, TextareaAutosize, Typography, Paper, IconButton, ThemeProvider, createTheme, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
    const [idToken, setIdToken] = useState<string>("");
    const [accessToken, setAccessToken] = useState<string>("");
    const [newIdToken, setNewIdToken] = useState<string>("");
    const [clientId, setClientId] = useState<string>("");
    const [tenantId, setTenantId] = useState<string>("");
    const [pca, setPca] = useState<PublicClientApplication | null>(null);

    const initialize = async () => {
        if (clientId && tenantId) {
            const msalConfig: Configuration = {
                auth: {
                    clientId: clientId,
                    authority: `https://login.microsoftonline.com/${tenantId}`,
                    redirectUri: "http://localhost:5173",
                },
            };
            const msalInstance = new PublicClientApplication(msalConfig);
            await msalInstance.initialize();
            setPca(msalInstance);
        }
    };

    useEffect(() => {
        if(clientId && tenantId && !pca) initialize();
    }, [clientId, tenantId, pca, initialize]);

    const handleLogin = async () => {
        if (!clientId || !tenantId || !pca) return;

        try {
            const loginResponse: AuthenticationResult = await pca.loginPopup({
                scopes: ["openid", "profile", "email"],
            });

            if (loginResponse.idToken) {
                setIdToken(loginResponse.idToken);
            }
            if(loginResponse.accessToken) {
                setAccessToken(loginResponse.accessToken);
            }
        } catch (error) {
            console.error("Login failed:", error);
            setIdToken("Error during login. Check console for details.");
        }
    };

    const handleRefreshToken = async () => {
        if (!pca) return;

        try {
            const accounts = pca.getAllAccounts();

            if (accounts.length === 0) {
                setNewIdToken("No user account found. Please log in first.");
                return;
            }

            const silentRequest: SilentRequest = {
                scopes: ["openid", "profile", "email"],
                account: accounts[0],
            };

            const silentResponse: AuthenticationResult = await pca.acquireTokenSilent(silentRequest);

            if (silentResponse.idToken) {
                setNewIdToken(silentResponse.idToken);
            }
        } catch (error) {
            console.error("Failed to refresh ID token:", error);
            setNewIdToken("Error while refreshing ID token. Check console for details.");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success("Copied to clipboard");
        }).catch(err => {
            console.error("Failed to copy: ", err);
        });
    };

    const theme = createTheme({
        palette: {
            primary: {
                main: "#1E88E5",
            },
            secondary: {
                main: "#00897B",
            },
        },
    });

    return (

            <ThemeProvider theme={theme}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100vh",
                        minWidth: "100vw",
                        backgroundColor: "#f5f5f5",
                        padding: 2,
                    }}
                >
                    <Paper elevation={3} sx={{ padding: 4, width: "70%", textAlign: "center" }}>
                        <Typography variant="h4" gutterBottom>
                            Azure AD Authentication
                        </Typography>
                        <TextField
                            label="Client ID"
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Tenant ID"
                            value={tenantId}
                            onChange={(e) => setTenantId(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={handleLogin} sx={{ margin: 2 }}>
                            Login with Azure AD
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleRefreshToken} sx={{ margin: 2 }}>
                            Refresh ID Token
                        </Button>
                        <Grid container>
                            <Grid size={3}>
                                <Typography variant="h6" gutterBottom>
                                    Access Token
                                </Typography>
                                <ToastContainer />
                                <IconButton onClick={() => copyToClipboard(accessToken)}>
                                    <ContentCopyIcon />
                                </IconButton>
                                <TextareaAutosize
                                    minRows={16}
                                    value={accessToken}
                                    placeholder="Initial Access Token will appear here..."
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        fontSize: "14px",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                        backgroundColor: "#f5f2f2",
                                    }}
                                    readOnly
                                />
                            </Grid>
                            <Grid size={1}></Grid>
                            <Grid size={3}>
                                <Typography variant="h6" gutterBottom>
                                    ID Token
                                </Typography>
                                <ToastContainer />
                                <IconButton onClick={() => copyToClipboard(idToken)}>
                                    <ContentCopyIcon />
                                </IconButton>
                                <TextareaAutosize
                                    minRows={16}
                                    value={idToken}
                                    placeholder="Initial ID Token will appear here..."
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        fontSize: "14px",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                        backgroundColor: "#f5f2f2",
                                    }}
                                    readOnly
                                />
                            </Grid>
                            <Grid size={1}></Grid>
                            <Grid size={3}>
                                <Typography variant="h6" gutterBottom>
                                    Refreshed ID Token
                                </Typography>
                                <IconButton onClick={() => copyToClipboard(newIdToken)}>
                                    <ContentCopyIcon />
                                </IconButton>
                                <TextareaAutosize
                                    minRows={16}
                                    value={newIdToken}
                                    placeholder="Refreshed ID Token will appear here..."
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        fontSize: "14px",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                        backgroundColor: "#f5f2f2",
                                    }}
                                    readOnly
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </ThemeProvider>

    );
};

export default App;