import React, {useEffect, useState} from "react";
import {Button, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import TextInput from "../../components/form/TextInput";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {HalfRow, Panel} from "../../components/panel";
import {Page, PageContentContainer, PageTitle, SinglePageColumn} from "../../components/page";
import LoadingButton from '@mui/lab/LoadingButton';
import {customerService} from "../../services/CustomerService";
import {Customer} from "../../model/customer";
import {Label} from "../../components/form/Label";
import {StatusChip} from "../../components/table";
import {Status} from "../../model/common";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import {SubscriptionsPanel} from "./SubscriptionsPanel";

const defaults = {
    customerId: "",
    email: "",
    status: "",
    subscription: {},
}

const AccountPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const methods = useForm<Customer>({
        mode: "onSubmit",
        defaultValues: defaults
    });

    useEffect(() => {
        getCurrentCustomerAsync();
    }, []);

    const getCurrentCustomerAsync = async () => {
        setLoading(true);
        try {
            const customer = await customerService.getCurrentCustomer()
            methods.reset(customer);
        } catch (err) {
            snackbar(t("error.fetchingCustomerDataFailed"), {variant: "error"})
        } finally {
            setLoading(false);
        }
    };

    const links = [
        {
            nameKey: "menu.exhibits",
            path: "/profile"
        }
    ]

    return (
        <Page>
            <FormProvider {...methods} >
                <form noValidate>
                    <AppBreadcrumbs links={links}/>
                    <PageTitle title={t('page.account.title')} subtitle={t('page.account.subtitle')}/>
                    <PageContentContainer>
                        <SinglePageColumn maxWidth='1024px'>
                            <Panel
                                loading={loading}
                                title={t('page.account.generalInfoForm.title')}
                                subtitle={t('page.account.generalInfoForm.subtitle')}
                                panelAction={<AccountActions/>}
                            >
                                <HalfRow>
                                    <Label label={t('page.account.generalInfoForm.accountId')}
                                           value={methods.getValues("customerId")}/>
                                </HalfRow>
                                <HalfRow>
                                    <Label label={t('page.account.generalInfoForm.email')}
                                           value={methods.getValues("email")}/>
                                </HalfRow>
                                <HalfRow>
                                    <Stack spacing={1} display={"block"}>
                                        <Typography
                                            variant='body1'>{t('page.account.generalInfoForm.status')}</Typography>
                                        <StatusChip status={methods.getValues("status") as Status} size="small"/>
                                    </Stack>
                                </HalfRow>
                            </Panel>

                            <SubscriptionsPanel currentPlanType={methods.getValues("subscription.plan")}/>

                            <Panel
                                loading={loading}
                                title={t('page.account.address.title')}
                                subtitle={t('page.account.address.subtitle')}
                                panelAction={<LoadingButton
                                    variant="outlined"
                                    startIcon={<PermContactCalendarOutlinedIcon/>}>
                                    {t('page.account.actions.saveChanges')}
                                </LoadingButton>}
                            >
                                <HalfRow>
                                    <TextInput
                                        name="fullName"
                                        title={t('page.account.address.fullName')}
                                        placeholder={t('page.account.address.fullName')}
                                        maxLength={128}
                                    />
                                </HalfRow>
                                <HalfRow>
                                    <TextInput
                                        name="address.street"
                                        title={t('page.account.address.street')}
                                        placeholder={t('page.account.address.street')}
                                        maxLength={128}
                                    />
                                </HalfRow>
                                <HalfRow>
                                    <TextInput
                                        name="address.houseNumber"
                                        title={t('page.account.address.houseNumber')}
                                        placeholder={t('page.account.address.houseNumber')}
                                        maxLength={128}
                                    />
                                </HalfRow>
                                <HalfRow>
                                    <TextInput
                                        name="address.houseNumberExtension"
                                        title={t('page.account.address.houseNumberExtension')}
                                        placeholder={t('page.account.address.houseNumberExtension')}
                                        maxLength={128}
                                    />
                                </HalfRow>
                                <HalfRow>
                                    <TextInput
                                        name="address.city"
                                        title={t('page.account.address.city')}
                                        placeholder={t('page.account.address.city')}
                                        maxLength={128}
                                    />
                                </HalfRow>
                                <HalfRow>
                                    <TextInput
                                        name="address.zipCode"
                                        title={t('page.account.address.zipCode')}
                                        placeholder={t('page.account.address.zipCode')}
                                        maxLength={128}
                                    />
                                </HalfRow>
                                <HalfRow>
                                    <TextInput
                                        name="address.telephoneNumber"
                                        title={t('page.account.address.telephoneNumber')}
                                        placeholder={t('page.account.address.telephoneNumber')}
                                        maxLength={128}
                                    />
                                </HalfRow>
                                <HalfRow>
                                    <TextInput
                                        name="address.taxNumber"
                                        title={t('page.account.address.taxNumber')}
                                        placeholder={t('page.account.address.taxNumber')}
                                        maxLength={128}
                                    />
                                </HalfRow>
                            </Panel>

                        </SinglePageColumn>
                    </PageContentContainer>
                </form>
            </FormProvider>
        </Page>
    );
};


const AccountActions = () => {
    const {t} = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                endIcon={<MoreVertIcon/>}
                variant={"outlined"}
                onClick={handleClick}
            >
                {t('page.account.actions.accountActions')}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>{t('page.account.actions.changePassword')}</MenuItem>
                <MenuItem onClick={handleClose}>{t('page.account.actions.deleteAccount')}</MenuItem>
            </Menu>
        </div>
    );
}

export default AccountPage;