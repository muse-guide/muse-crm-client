import {Outlet} from "react-router-dom";
import {Box, CssBaseline, Stack} from "@mui/material";
import React, {createContext, useEffect, useState} from "react";
import Navigation from "../components/navigation";
import '@aws-amplify/ui-react/styles.css';
import {ApplicationConfiguration, ApplicationContext} from "../model/configuration";
import {customerService} from "../services/CustomerService";
import {Customer} from "../model/customer";
import {configurationService} from "../services/ConfigurationService";
import {Authenticator, Theme, ThemeProvider, useTheme, View} from "@aws-amplify/ui-react";
import CircularProgress from "@mui/material/CircularProgress";
import {mainBackgroundColor} from "../index";
import {useHandleError} from "../http/errorHandler";

export const AppContext = createContext<ApplicationContext | null>(null);

const App = () => {
    const drawerWidth = 320;

    const [applicationConfiguration, setApplicationConfiguration] = React.useState<ApplicationConfiguration | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const handleError = useHandleError();

    useEffect(() => {
        getConfiguration();
    }, []);

    const getConfiguration = async () => {
        setLoading(true);
        try {
            const customerPromise = customerService.getCurrentCustomer()
            const applicationConfigurationPromise = configurationService.getApplicationConfiguration()
            const [customer, applicationConfiguration] = await Promise.all([customerPromise, applicationConfigurationPromise])

            setCustomer(customer);
            setApplicationConfiguration(applicationConfiguration);
        } catch (error) {
            handleError("error.fetchingCustomerDataFailed", error);
        } finally {
            setLoading(false);
        }
    };

    const refreshCustomer = async () => {
        try {
            const customer = await customerService.getCurrentCustomer()
            setCustomer(customer);
        } catch (error) {
            handleError("error.fetchingCustomerDataFailed", error);
        }
    }

    return (
        <Box width={"100%"} sx={{backgroundColor: mainBackgroundColor}}>
            {loading || !applicationConfiguration || !customer ? <LoadingPage/> :
                <AppContext.Provider value={{
                    configuration: applicationConfiguration,
                    customer: customer,
                    setCustomer: setCustomer,
                    refreshCustomer: refreshCustomer,
                }}>
                    <Box display='flex' height={"100%"} sx={{backgroundColor: mainBackgroundColor}}>
                        <CssBaseline/>
                        <Navigation drawerWidth={drawerWidth}/>
                        <Box component="main"
                             display='flex'
                             flexDirection='column'
                             flexGrow={1}
                             minWidth="600px"
                             sx={{
                                 marginLeft: {
                                     md: `${drawerWidth}px`
                                 },
                                 paddingTop: {
                                     xs: 10,
                                     md: 3
                                 },
                                 paddingLeft: {
                                     xs: 3,
                                     md: 10,
                                 },
                                 paddingRight: {
                                     xs: 3,
                                     md: 12,
                                 },
                             }}
                        >
                            <Outlet/>
                        </Box>
                    </Box>
                </AppContext.Provider>
            }
        </Box>
    );
}

const LoadingPage = () => {
    return (
        <Stack width={"100%"} height={"100vh"} justifyContent={"center"} alignItems={"center"}>
            <Stack direction={"row"} gap={1.5} alignItems={"center"}>
                <CircularProgress size={20}/>
                Loading...
            </Stack>
        </Stack>
    )
}

const Root = () => {
    const {tokens} = useTheme();

    const components = {
        Header() {
            return (
                <View textAlign="center" padding={tokens.space.xl} paddingBottom={tokens.space.xxl}>
                    <img
                        height={120}
                        width={120}
                        alt="Musee logo"
                        src="/logo-circle.png"
                    />
                </View>
            );
        },

        Footer() {
            const {tokens} = useTheme();

            return (
                <View textAlign="center" padding={tokens.space.large}>
                    &copy;musee All Rights Reserved, 2025
                </View>
            );
        },
    }

    const theme: Theme = {
        name: 'Auth Example Theme',
        tokens: {
            components: {
                authenticator: {
                    router: {
                        boxShadow: `0 0 16px ${tokens.colors.neutral['40']}`,
                        borderWidth: '0',
                    },
                    form: {
                        padding: `${tokens.space.medium} ${tokens.space.xl} ${tokens.space.medium}`,
                    },
                },
                button: {
                    primary: {
                        backgroundColor: tokens.colors.neutral['100'],
                        _hover: {
                            backgroundColor: tokens.colors.neutral['80'],
                        },
                    },
                    link: {
                        color: tokens.colors.neutral['80'],
                    },
                },
                fieldcontrol: {
                    _focus: {
                        boxShadow: `0 0 0 2px ${tokens.colors.neutral['60']}`,
                    },
                },
                tabs: {
                    item: {
                        color: tokens.colors.neutral['80'],
                        _active: {
                            borderColor: tokens.colors.neutral['100'],
                            color: tokens.colors.neutral['100'],
                        },
                    },
                },
            },
        },
    };

    const formFields = {
        signIn: {
            username: {
                label: 'Email:',
                placeholder: 'Enter your email',
            },
        },
        signUp: {
            username: {
                label: 'Email:',
                placeholder: 'Enter your email',
                order: 1
            },
            password: {
                label: 'Password:',
                placeholder: 'Enter your Password:',
                isRequired: false,
                order: 2,
            },
            confirm_password: {
                label: 'Confirm Password:',
                order: 3,
            },
        },
        forceNewPassword: {
            password: {
                placeholder: 'Enter your Password:',
            },
        },
        forgotPassword: {
            username: {
                placeholder: 'Enter your email:',
            },
        },
        confirmResetPassword: {
            confirmation_code: {
                placeholder: 'Enter your Confirmation Code:',
                label: 'New Label',
                isRequired: false,
            },
            confirm_password: {
                placeholder: 'Enter your Password Please:',
            },
        },
        confirmSignIn: {
            confirmation_code: {
                label: 'New Label',
                placeholder: 'Enter your Confirmation Code:',
                isRequired: false,
            },
        },
        setupEmail: {
            email: {
                label: 'New Label',
                placeholder: 'Please enter your Email:',
            },
        },
    };

    return (
        <ThemeProvider theme={theme}>
            <View padding="xxxl">
                <Authenticator formFields={formFields} components={components}>
                    <App/>
                </Authenticator>
            </View>
        </ThemeProvider>
    );
}

export default Root
