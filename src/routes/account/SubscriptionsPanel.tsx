import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {SubscriptionPlan} from "../../model/configuration";
import {Panel} from "../../components/panel";
import {Box, Button, Card, CardContent, Divider, Grid2, List, ListItem, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {customerService} from "../../services/CustomerService";
import {useApplicationContext} from "../../components/hooks";
import {useHandleError} from "../../http/errorHandler";

export const SubscriptionsPanel = ({currentPlanType}: { currentPlanType: string }) => {
    const {setCustomer, configuration} = useApplicationContext();
    const [processing, setProcessing] = useState<boolean>(false);
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const [currentPlan, setCurrentPlan] = useState<string>(currentPlanType);
    const handleError = useHandleError();

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
        } catch (error) {
            handleError("error.updatingSubscriptionFailed", error);
        } finally {
            setProcessing(false);
        }
    }

    const freePlan = configuration?.subscriptionPlans.find(plan => plan.type === 'FREE');
    const monthlySubscriptionPlans = configuration?.subscriptionPlans.filter(plan => plan.durationMonths === 1);
    const yearlySubscriptionPlans = configuration?.subscriptionPlans.filter(plan => plan.durationMonths === 12);

    if (!configuration) return

    return (
        <Panel
            loading={processing}
            title={t('page.account.subscription.title')}
            subtitle={t('page.account.subscription.subtitle')}
        >
            <Grid2 size={{xs: 12, md: 12}}>
                <Typography variant="body1" sx={{fontWeight: 600}}>
                    {t('page.account.subscription.monthlyPlans')}
                </Typography>
            </Grid2>

            <Grid2 size={{xs: 12, md: 3}}>
                {freePlan && <SubscriptionPlanCard plan={freePlan} currentPlan={currentPlan} changePlan={() => changePlan(freePlan.type)}/>}
            </Grid2>

            {monthlySubscriptionPlans && monthlySubscriptionPlans.map(plan =>
                <Grid2 size={{xs: 12, md: 3}}>
                    <SubscriptionPlanCard key={plan.type} plan={plan} currentPlan={currentPlan} changePlan={() => changePlan(plan.type)}/>
                </Grid2>
            )}

            <Grid2 size={{xs: 12, md: 12}}>
                <Divider/>
            </Grid2>

            <Grid2 size={{xs: 12, md: 12}}>
                <Typography variant="body1" sx={{fontWeight: 600}}>
                    {t('page.account.subscription.yearlyPlans')}
                </Typography>
            </Grid2>

            <Grid2 size={{xs: 12, md: 3}}>
                {freePlan && <SubscriptionPlanCard plan={freePlan} currentPlan={currentPlan} changePlan={() => changePlan(freePlan.type)}/>}
            </Grid2>

            {yearlySubscriptionPlans && yearlySubscriptionPlans.map(plan =>
                <Grid2 size={{xs: 12, md: 3}}>
                    <SubscriptionPlanCard key={plan.type} plan={plan} currentPlan={currentPlan} changePlan={() => changePlan(plan.type)}/>
                </Grid2>
            )}
        </Panel>
    )
}

const SubscriptionPlanCard = ({plan, currentPlan, changePlan}: { plan: SubscriptionPlan, currentPlan: string, changePlan: () => void }) => {
    const {t} = useTranslation();
    const isActive = plan.type === currentPlan;

    const formatTokenCount = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }
        return count.toString();
    }

    const formatStandardMinutes = (tokens: number) => {
        const totalMinutes = Math.floor(tokens / 1000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    }

    const formatPremiumMinutes = (tokens: number) => {
        const totalMinutes = Math.floor(tokens / 5000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    }

    return (
        <Card variant={isActive ? 'elevation' : 'outlined'} elevation={isActive ? 3 : 0}>
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant={"body1"} sx={{fontWeight: 600}} gutterBottom>
                        {plan.name}
                    </Typography>
                    {isActive && <CheckCircleIcon color="primary" fontSize="large"/>}
                </Stack>
                <Stack direction='row' alignItems={"center"} mt={1} gap={0.5}>
                    <Typography variant="h6" sx={{fontWeight: 600}}>
                        {`$${plan.price} `}
                    </Typography>
                    {plan.type !== 'FREE' && <Typography variant="body1" fontWeight="normal">
                        {plan.durationMonths === 12 ? t('page.account.subscription.perYear') : t('page.account.subscription.perMonth')}
                    </Typography>}
                </Stack>
                <List dense sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper', mt: 1}}>
                    <ListItem sx={{pl: 0, py: 0}}>
                        <ListItemIcon>
                            <CheckCircleOutlineIcon fontSize={"small"}/>
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant={"body2"}>{t('page.account.subscription.exhibitionsNumber')}: {plan.maxExhibitions}</Typography>}/>
                    </ListItem>
                    <ListItem sx={{pl: 0, py: 0}}>
                        <ListItemIcon>
                            <CheckCircleOutlineIcon fontSize={"small"}/>
                        </ListItemIcon>
                        <ListItemText primary={`${t('page.account.subscription.exhibitsNumber')}: ${plan.maxExhibits}`}/>
                    </ListItem>
                    <ListItem sx={{pl: 0, py: 0}}>
                        <ListItemIcon>
                            <CheckCircleOutlineIcon fontSize={"small"}/>
                        </ListItemIcon>
                        <ListItemText primary={`${t('page.account.subscription.langOptsNumber')}: ${plan.maxLanguages}`}/>
                    </ListItem>
                    <ListItem sx={{pl: 0, py: 0}}>
                        <ListItemIcon>
                            <CheckCircleOutlineIcon fontSize={"small"}/>
                        </ListItemIcon>
                        <ListItemText primary={`${t('page.account.subscription.tokensNumber')}: ${formatTokenCount(plan.tokenCount)}`}/>
                    </ListItem>
                    <ListItem sx={{pl: 0, py: 0}}>
                        <ListItemIcon>
                            <CheckCircleOutlineIcon fontSize={"small"}/>
                        </ListItemIcon>
                        <ListItemText primary={`${t('page.account.subscription.standardVoices')}: ~${formatStandardMinutes(plan.tokenCount)}`}/>
                    </ListItem>
                    <ListItem sx={{pl: 0, py: 0}}>
                        <ListItemIcon>
                            <CheckCircleOutlineIcon fontSize={"small"}/>
                        </ListItemIcon>
                        <ListItemText primary={`${t('page.account.subscription.premiumVoices')}: ~${formatPremiumMinutes(plan.tokenCount)}`}/>
                    </ListItem>
                </List>
                {
                    isActive
                        ? <Box display={"flex"} alignItems={"center"} justifyContent={"center"} width={"100%"} py={1} mt={1.5}>
                            <Typography variant="body1" fontWeight={"bolder"}>{t('page.account.subscription.activePlan')}</Typography>
                        </Box>
                        : <Button onClick={changePlan} fullWidth variant='outlined' sx={{mt: 3}}>{t('page.account.subscription.subscribeTo')}</Button>
                }
            </CardContent>
        </Card>
    );
}