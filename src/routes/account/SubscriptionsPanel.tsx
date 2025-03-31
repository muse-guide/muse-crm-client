import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {SubscriptionPlan} from "../../model/configuration";
import {Panel} from "../../components/panel";
import {Box, Button, Card, CardContent, Grid2, List, ListItem, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {customerService} from "../../services/CustomerService";
import {ApiException} from "../../http/types";
import {useApplicationContext} from "../../components/hooks";

export const SubscriptionsPanel = ({currentPlanType}: { currentPlanType: string }) => {
    const {setCustomer, configuration} = useApplicationContext();
    const [processing, setProcessing] = useState<boolean>(false);
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const [currentPlan, setCurrentPlan] = useState<string>(currentPlanType);

    useEffect(() => {
        setCurrentPlan(currentPlanType);
    }, [currentPlanType]);

    const changePlan = async (newPlan: string) => {
        setProcessing(true);
        try {
            const customer = await customerService.changeSubscription(newPlan)

            setCustomer(customer);
            setCurrentPlan(customer.subscription.plan);

            snackbar(t("success.subscriptionUpdated"), {variant: "success"})
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
            loading={processing}
            title={t('page.account.subscription.title')}
            subtitle={t('page.account.subscription.subtitle')}
        >
            {
                configuration && configuration.subscriptionPlans.map((plan, index) => (
                    <Grid2 size={{xs: 12, md: 4}} key={index}>
                        <SubscriptionPlanCard plan={plan} currentPlan={currentPlan} changePlan={() => changePlan(plan.type)}/>
                    </Grid2>
                ))
            }
        </Panel>
    )
}

const SubscriptionPlanCard = ({plan, currentPlan, changePlan}: { plan: SubscriptionPlan, currentPlan: string, changePlan: () => void }) => {
    const {t} = useTranslation();
    const isActive = plan.type === currentPlan;

    return (
        <Card variant={isActive ? 'elevation' : 'outlined'} elevation={isActive ? 3 : 0}>
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant={"h6"} sx={{fontWeight: 600}} gutterBottom>
                        {plan.type}
                    </Typography>
                    {isActive && <CheckCircleIcon color="primary" fontSize="large"/>}
                </Stack>
                <Stack direction='row' alignItems={"end"} mt={3}>
                    <Typography variant="h4" sx={{fontWeight: 600}}>
                        {`$${plan.price}`}
                    </Typography>
                    <Typography variant="body1" fontWeight="normal">
                        /{t('page.account.subscription.perMonth')}
                    </Typography>
                </Stack>
                {
                    isActive
                        ? <Box display={"flex"} alignItems={"center"} justifyContent={"center"} width={"100%"} py={1} mt={3}>
                            <Typography variant="body1">{t('page.account.subscription.activePlan')}</Typography>
                        </Box>
                        : <Button onClick={changePlan} fullWidth variant='outlined' sx={{mt: 3}}>{t('page.account.subscription.subscribeTo')}</Button>
                }
                <List dense sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper', mt: 1}}>
                    <ListItem>
                        <ListItemIcon>
                            <CheckCircleOutlineIcon/>
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant={"body2"}>{t('page.account.subscription.exhibitionsNumber')}: {plan.maxExhibitions}</Typography>}/>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <CheckCircleOutlineIcon/>
                        </ListItemIcon>
                        <ListItemText primary={`${t('page.account.subscription.exhibitsNumber')}: ${plan.maxExhibits}`}/>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <CheckCircleOutlineIcon/>
                        </ListItemIcon>
                        <ListItemText primary={`${t('page.account.subscription.langOptsNumber')}: ${plan.maxLanguages}`}/>
                    </ListItem>
                </List>
            </CardContent>
        </Card>
    );
}