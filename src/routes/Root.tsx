import {Outlet} from "react-router-dom";
import {Box, CssBaseline, Stack} from "@mui/material";
import React, {createContext, useEffect, useState} from "react";
import Navigation from "../components/navigation";
import '@aws-amplify/ui-react/styles.css';
import {ApplicationConfiguration, ApplicationContext} from "../model/configuration";
import {customerService} from "../services/CustomerService";
import {Customer} from "../model/customer";
import {useSnackbar} from "notistack";
import {useTranslation} from "react-i18next";
import {configurationService} from "../services/ConfigurationService";
import {withAuthenticator} from "@aws-amplify/ui-react";
import CircularProgress from "@mui/material/CircularProgress";
import {grey} from "@mui/material/colors";
import {mainBackgroundColor} from "../index";

export const AppContext = createContext<ApplicationContext | null>(null);

const Root = () => {
    const drawerWidth = 320;

    const [applicationConfiguration, setApplicationConfiguration] = React.useState<ApplicationConfiguration | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const {enqueueSnackbar: snackbar} = useSnackbar();
    const {t} = useTranslation();


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
        } catch (err) {
            snackbar(t("error.fetchingCustomerDataFailed"), {variant: "error"})
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box width={"100%"} sx={{backgroundColor: mainBackgroundColor}}>
            {loading || !applicationConfiguration || !customer ? <LoadingPage/> :
                <AppContext.Provider value={{
                    configuration: applicationConfiguration,
                    customer: customer,
                    setCustomer: setCustomer
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


export default withAuthenticator(Root);
