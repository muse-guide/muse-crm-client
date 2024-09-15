import {Outlet} from "react-router-dom";
import {Box, CssBaseline} from "@mui/material";
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
        <>
            {loading || !applicationConfiguration || !customer ? <div>Loading...</div> :
                <AppContext.Provider value={{
                    configuration: applicationConfiguration,
                    customer: customer,
                    setCustomer: setCustomer
                }}>
                    <Box display='flex' overflow={"clip"}>
                        <CssBaseline/>
                        <Navigation drawerWidth={drawerWidth}/>
                        <Box component="main"
                             display='flex'
                             flexGrow={1}
                             minWidth="600px"
                             sx={{
                                 marginLeft: {
                                     md: `${drawerWidth}px`
                                 },
                                 marginTop: {
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
                                 backgroundColor: "white"
                             }}
                        >
                            <Outlet/>
                        </Box>
                    </Box>
                </AppContext.Provider>
            }
        </>
    );
}


export default withAuthenticator(Root);
