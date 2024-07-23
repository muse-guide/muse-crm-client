import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {ApplicationConfiguration, SubscriptionPlan} from "../../model/configuration";
import {configurationService} from "../../services/ConfigurationService";
import {Panel} from "../../components/panel";
import Grid from "@mui/material/Unstable_Grid2";
import {Button, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {customerService} from "../../services/CustomerService";
import {ApiException} from "../../http/types";

export const SubscriptionsPanel = ({currentPlanType}: { currentPlanType: string }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const [configuration, setConfiguration] = useState<ApplicationConfiguration | null>(null);
    const [currentPlan, setCurrentPlan] = useState<string>(currentPlanType);

    useEffect(() => {
        setCurrentPlan(currentPlanType);
        getConfigurationAsync();
    }, [currentPlanType]);

    const getConfigurationAsync = async () => {
        setLoading(true);
        try {
            const configuration = await configurationService.getApplicationConfiguration()
            setConfiguration(configuration);
        } catch (err) {
            snackbar(t("error.fetchingConfigurationFailed"), {variant: "error"})
        } finally {
            setLoading(false);
        }
    };

    const changePlan = async (newPlan: string) => {
        setProcessing(true);
        try {
            const customer = await customerService.changeSubscription(newPlan)
            snackbar(t("success.subscriptionUpdated"), {variant: "success"})
            setCurrentPlan(customer.subscription.plan);
        } catch (err) {
            if (err instanceof ApiException) {
                snackbar(err.message, {variant: "error"})
            } else {
                snackbar(t("error.updatingSubscriptionFailed"), {variant: "error"})
            }
        } finally {
            setProcessing(false);
        }
    }

    return (
        <Panel
            loading={loading || processing}
            title={t('page.account.subscription.title')}
            subtitle={t('page.account.subscription.subtitle')}
        >
            {
                configuration && configuration.subscriptionPlans.map((plan, index) => (
                    <Grid xs={12} md={4} key={index}>
                        <SubscriptionPlanCard plan={plan} currentPlan={currentPlan} changePlan={() => changePlan(plan.type)}/>
                    </Grid>
                ))
            }
        </Panel>
    )
}

const SubscriptionPlanCard = ({plan, currentPlan, changePlan}: { plan: SubscriptionPlan, currentPlan: string, changePlan: () => void }) => {
    const {t} = useTranslation();
    const isActive = plan.type === currentPlan;

    console.log(plan.type, currentPlan, isActive);

    return (
        <Card variant={isActive ? 'elevation' : 'outlined'} elevation={isActive ? 5 : 0}>
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant={"h6"} fontWeight={"bolder"} gutterBottom>
                        {plan.type}
                    </Typography>
                    {isActive && <CheckCircleIcon color="success" fontSize="large"/>}
                </Stack>
                <Stack direction='row' alignItems={"end"} mt={3}>
                    <Typography variant="h4" fontWeight="bold">
                        {`$${plan.price}`}
                    </Typography>
                    <Typography variant="body1" fontWeight="normal">
                        {t('/per month')}
                    </Typography>
                </Stack>
                <Button disabled={isActive} onClick={changePlan} fullWidth variant='outlined' sx={{mt: 3}}>Subscribe to</Button>
                <List dense sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper', mt: 1}}>
                    <ListItem>
                        <ListItemIcon>
                            <CheckCircleOutlineIcon/>
                        </ListItemIcon>
                        <ListItemText primary={`No. of exhibitions: ${plan.maxExhibitions}`}/>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <CheckCircleOutlineIcon/>
                        </ListItemIcon>
                        <ListItemText primary={`No. of exhibits: ${plan.maxExhibits}`}/>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <CheckCircleOutlineIcon/>
                        </ListItemIcon>
                        <ListItemText primary={`No. of language options: ${plan.maxLanguages}`}/>
                    </ListItem>
                </List>
            </CardContent>
        </Card>
    );
}