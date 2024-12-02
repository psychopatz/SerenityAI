import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { 
    Box,
    Card,
    CardContent,
    Typography,
    Switch,
    FormGroup,
    FormControlLabel,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import privacySettingsService from '../services/PrivacySettingsService';
import UserService from '../services/UserService';
import StorageService from '../services/StorageService';

// Styled Components
const PageWrapper = styled(Box)({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

});

const SettingsContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: 600,
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(2),
        padding: theme.spacing(2)
    }
}));

const SettingsCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[3],
    background: "linear-gradient(145deg, #FFECA1, #98F5F9)",
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
        boxShadow: theme.shadows[6]
    }
}));

const SettingsContent = styled(CardContent)(({ theme }) => ({
    '&:last-child': {
        paddingBottom: theme.spacing(3)
    }
}));

const SettingsTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    fontWeight: 600,
    color: theme.palette.text.primary,
    textAlign: 'center'
}));

const SettingDescription = styled(Typography)(({ theme }) => ({
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
    fontSize: '0.875rem'
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    width: '100%'
}));

const StyledFormGroup = styled(FormGroup)(({ theme }) => ({
    '& .MuiFormControlLabel-root': {
        marginBottom: theme.spacing(1)
    },
    '& .MuiSwitch-root': {
        marginRight: theme.spacing(1)
    }
}));

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const storageService = StorageService();
    const [settings, setSettings] = useState({
        dataSharingConsent: false,
        emailNotificationConsent: false,
        profileVisibility: false
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        initializeSettings();
    }, []);

    const initializeSettings = async () => {
        try {
            setLoading(true);
            const userdata = storageService.getLocalStorage('userdata');
            
            if (userdata.privacy_id === 0) {
                const newPrivacyId = await privacySettingsService.createPrivacySettings(settings);
                storageService.setLocalStorage('userdata', { ...userdata, privacy_id: newPrivacyId });
                await UserService.updateUserById(userdata.user_id, { privacy_id: newPrivacyId });
                setSettings(settings);
            } else {
                const existingSettings = await privacySettingsService.getPrivacySettingsById(userdata.privacy_id);
                setSettings(existingSettings);
            }
        } catch (err) {
            setError('Failed to initialize privacy settings');
            setSnackbar({
                open: true,
                message: 'Failed to load privacy settings',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (settingKey) => {
        try {
            const userdata = storageService.getLocalStorage('userdata');
            const newSettings = {
                ...settings,
                [settingKey]: !settings[settingKey]
            };

            await privacySettingsService.createPrivacySettings({
                ...newSettings,
                privacyId: userdata.privacy_id
            });

            setSettings(newSettings);
            setSnackbar({
                open: true,
                message: 'Settings updated successfully',
                severity: 'success'
            });
        } catch (err) {
            setError('Failed to update setting');
            setSnackbar({
                open: true,
                message: 'Failed to update setting',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <PageWrapper>
                <LoadingContainer>
                    <CircularProgress />
                </LoadingContainer>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <SettingsContainer>
                <SettingsCard>
                    <SettingsContent>
                        <SettingsTitle variant="h5" component="h2">
                            Privacy Settings
                        </SettingsTitle>
                        
                        <StyledFormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.dataSharingConsent}
                                        onChange={() => handleToggle('dataSharingConsent')}
                                        color="primary"
                                    />
                                }
                                label="Data Sharing"
                            />
                            <SettingDescription>
                                Allow us to share your data with trusted partners to improve your experience
                            </SettingDescription>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.emailNotificationConsent}
                                        onChange={() => handleToggle('emailNotificationConsent')}
                                        color="primary"
                                    />
                                }
                                label="Email Notifications"
                            />
                            <SettingDescription>
                                Receive email notifications about updates and new features
                            </SettingDescription>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.profileVisibility}
                                        onChange={() => handleToggle('profileVisibility')}
                                        color="primary"
                                    />
                                }
                                label="Profile Visibility"
                            />
                            <SettingDescription>
                                Make your profile visible to other users
                            </SettingDescription>
                        </StyledFormGroup>
                    </SettingsContent>
                </SettingsCard>

                <Snackbar 
                    open={snackbar.open} 
                    autoHideDuration={6000} 
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={handleCloseSnackbar} 
                        severity={snackbar.severity}
                        variant="filled"
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </SettingsContainer>
        </PageWrapper>
    );
};

export default Settings;