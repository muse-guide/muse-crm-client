import React, {useEffect, useState} from "react";
import {Button, Chip, Divider, Menu, MenuItem, Stack, Typography, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import TextInput from "../../components/form/TextInput";
import {FormProvider, useForm} from "react-hook-form";
import {useSnackbar} from "notistack";
import {FullRow, HalfRow, Panel} from "../../components/panel";
import {Page, PageContentContainer, PageTitle, SinglePageColumn} from "../../components/page";
import {customerService} from "../../services/CustomerService";
import {Customer} from "../../model/customer";
import {Label} from "../../components/form/Label";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import {SubscriptionsPanel} from "./SubscriptionsPanel";
import useDialog, {useApplicationContext, useTokenCount} from "../../components/hooks";
import {ChangePasswordDialog} from "./ChangePasswordDialog";

const AccountPage = () => {
    const {customer, setCustomer} = useApplicationContext();
    const {counter} = useTokenCount()
    const [loading, setLoading] = useState<boolean>(false);
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();

    const methods = useForm<Customer>({
        mode: "onSubmit",
        defaultValues: customer
    });

    const updateCustomerDetails = async (data: Customer) => {
        setLoading(true);
        try {
            const updatedCustomer = await customerService.updateCustomerDetails(data);
            setCustomer(updatedCustomer);
            methods.reset(updatedCustomer);
            snackbar(t("success.customerDetailsUpdated"), {variant: "success"})
        } catch (err) {
            snackbar(t("error.updatingCustomerDetailsFailed"), {variant: "error"})
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        methods.reset(customer);
    }, [customer]);

    const links = [
        {
            nameKey: "menu.account",
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
                                    <Stack spacing={1} display={"block"}>
                                        <Typography
                                            variant='body1'>{t('page.account.generalInfoForm.accountStatus')}</Typography>
                                        <AccountStatusChip status={methods.getValues("status")} size="small"/>
                                    </Stack>
                                </HalfRow>
                                <HalfRow>
                                    <Label label={t('page.account.generalInfoForm.email')}
                                           value={methods.getValues("email")}/>
                                </HalfRow>
                                <FullRow>
                                    <Divider/>
                                </FullRow>
                                <HalfRow>
                                    <Label label={t('page.account.generalInfoForm.plan')}
                                           value={methods.getValues("subscription.plan")}/>
                                </HalfRow>
                                <HalfRow>
                                    <Stack spacing={1} display={"block"}>
                                        <Typography
                                            variant='body1'>{t('page.account.generalInfoForm.subscriptionStatus')}</Typography>
                                        <AccountStatusChip status={methods.getValues("subscription.status")} size="small"/>
                                    </Stack>
                                </HalfRow>
                                <HalfRow>
                                    <Label label={t('page.account.generalInfoForm.expiredAt')}
                                           value={methods.getValues("subscription.expiredAt")}/>
                                </HalfRow>
                                <HalfRow>
                                    <Label label={t('page.account.generalInfoForm.tokenCount')}
                                           value={counter}/>
                                </HalfRow>
                            </Panel>

                            <SubscriptionsPanel currentPlanType={methods.getValues("subscription.plan")}/>

                            <Panel
                                loading={loading}
                                title={t('page.account.address.title')}
                                subtitle={t('page.account.address.subtitle')}
                                panelAction={<Button
                                    variant="outlined"
                                    startIcon={<PermContactCalendarOutlinedIcon/>}
                                    onClick={() => updateCustomerDetails(methods.getValues())}
                                >
                                    {t('page.account.actions.saveChanges')}
                                </Button>}
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
                                        name="taxNumber"
                                        title={t('page.account.address.taxNumber')}
                                        placeholder={t('page.account.address.taxNumber')}
                                        maxLength={128}
                                    />
                                </HalfRow>
                                <FullRow py={2}>
                                    <Divider/>
                                </FullRow>
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
                                        name="address.country"
                                        title={t('page.account.address.countryCode')}
                                        placeholder={t('page.account.address.countryCode')}
                                        maxLength={128}
                                    />
                                </HalfRow>
                                <HalfRow>
                                    <TextInput
                                        name="telephoneNumber"
                                        title={t('page.account.address.telephoneNumber')}
                                        placeholder={t('page.account.address.telephoneNumber')}
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
    const changePasswordDialog = useDialog()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        setAnchorEl(null)
    }, [changePasswordDialog.isOpen])

    const onChangePassword = () => {
        changePasswordDialog.openDialog()
    }

    return (
        <>
            <ChangePasswordDialog
                open={changePasswordDialog.isOpen}
                handleClose={changePasswordDialog.closeDialog}
            />
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
                <MenuItem onClick={onChangePassword}>{t('page.account.actions.changePassword')}</MenuItem>
            </Menu>
        </>
    );
}
export const AccountStatusChip = ({status, size}: { status: string, size?: "small" | "medium" }) => {
    const theme = useTheme()
    switch (status) {
        case "ACTIVE":
            return <Chip label="Active" size={size ?? "small"} variant="filled" sx={{backgroundColor: theme.palette.success.light}}/>
        case "DEACTIVATED":
            return <Chip label="Deactivated" size={size ?? "small"} variant="filled" sx={{backgroundColor: theme.palette.error.light}}/>
        case "LOCKED":
            return <Chip label="Locked" size={size ?? "small"} variant="filled" sx={{backgroundColor: theme.palette.info.light}}/>
        case "AWAITING_PAYMENT":
            return <Chip label="Awaiting payment" size={size ?? "small"} variant="filled" sx={{backgroundColor: theme.palette.info.light}}/>
    }
}

export default AccountPage;