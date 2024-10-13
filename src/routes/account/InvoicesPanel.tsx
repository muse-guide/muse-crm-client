import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {Panel} from "../../components/panel";
import {Avatar, Button, FormControl, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, SelectChangeEvent, Stack, Typography, useTheme} from "@mui/material";
import {Invoice, InvoicePaymentStatus} from "../../model/invoice";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useDialog from "../../components/hooks";
import {InvoiceDialog} from "./InvoiceDialog";
import {InvoiceStatusChip} from "./InvoiceStatusChip";
import {invoiceService} from "../../services/InvoiceService";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {grey} from "@mui/material/colors";
import CircleIcon from '@mui/icons-material/Circle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const InvoicesPanel = () => {
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const invoiceDialog = useDialog()
    const theme = useTheme()

    const [nextPageKey, setNextPageKey] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [invoiceId, setInvoiceId] = useState<string | undefined>(undefined);
    const [paymentStatus, setPaymentStatus] = useState<InvoicePaymentStatus>("UNPAID");

    useEffect(() => {
        getCustomerInvoice();
    }, [paymentStatus]);

    const getCustomerInvoice = async () => {
        setLoading(true);
        try {
            const results = await invoiceService.getCustomerInvoices(paymentStatus, nextPageKey);
            setInvoices(prevState => prevState.concat(results.items as Invoice[]));
            setNextPageKey(results.nextPageKey);
        } catch (err) {
            snackbar(t("error.fetchingInvoicesFailed"), {variant: "error"})
        } finally {
            setLoading(false);
        }
    }

    const handleInvoiceClick = async (invoiceId: string) => {
        setInvoiceId(invoiceId);
        invoiceDialog.openDialog();
    }

    const handlePaymentStatusChange = (event: SelectChangeEvent) => {
        setInvoices([]);
        setNextPageKey(undefined);
        setPaymentStatus(event.target.value as InvoicePaymentStatus);
    }

    return (
        <Panel
            loading={loading}
            title={t('page.account.invoices.title')}
            subtitle={t('page.account.invoices.subtitle')}
            panelAction={
                <FormControl>
                    <Select
                        value={paymentStatus}
                        onChange={(event: SelectChangeEvent) => handlePaymentStatusChange(event)}
                        size={"small"}
                        sx={{
                            minWidth: "100px",
                            height: "36px",
                            color: grey[500],
                        }}
                    >
                        <MenuItem value={'ALL'}>
                            <Stack direction={"row"} gap={1} alignItems={"center"} fontSize={"14px"}>
                                <CircleIcon sx={{color: theme.palette.info.dark}} fontSize={"inherit"}/>
                                <Typography variant={"button"}>{t('page.account.invoices.all')}</Typography>
                            </Stack>
                        </MenuItem>
                        <MenuItem value={'PAID'}>
                            <Stack direction={"row"} gap={1} alignItems={"center"} fontSize={"14px"}>
                                <CircleIcon sx={{color: theme.palette.success.dark}} fontSize={"inherit"}/>
                                <Typography variant={"button"}>{t('page.account.invoices.paid')}</Typography>
                            </Stack>
                        </MenuItem>
                        <MenuItem value={'UNPAID'}>
                            <Stack direction={"row"} gap={1} alignItems={"center"} fontSize={"14px"}>
                                <CircleIcon sx={{color: theme.palette.warning.light}} fontSize={"inherit"}/>
                                <Typography variant={"button"}>{t('page.account.invoices.unpaid')}</Typography>
                            </Stack>
                        </MenuItem>
                    </Select>
                </FormControl>
            }
        >
            <InvoiceDialog
                invoiceId={invoiceId}
                open={invoiceDialog.isOpen}
                handleClose={invoiceDialog.closeDialog}
            />
            <Stack spacing={2} width="100%">
                <List>
                    {invoices.map(invoice => (
                        <ListItem key={invoice.invoiceId}>
                            <ListItemAvatar>
                                <Avatar sx={{backgroundColor: grey[200]}}>
                                    <DescriptionOutlinedIcon color={"primary"}/>
                                </Avatar>
                            </ListItemAvatar>
                            <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between" gap={2}>
                                <ListItemText primary={invoice.invoiceBusinessId} secondary={`${invoice.periodStart} - ${invoice.periodEnd}`}/>
                                <Stack direction="row" px={2} justifyContent="start" alignItems="center" minWidth={"140px"}>
                                    <InvoiceStatusChip status={invoice.status}/>
                                </Stack>
                                <Stack direction="row" mx={2} gap={2} alignItems="center" minWidth={"140px"}>
                                    <Typography variant={"body1"} fontWeight="">{t("Total")}:</Typography>
                                    <Typography variant={"body1"} sx={{fontWeight: 700}}>{invoice.amount}zł</Typography>
                                </Stack>
                                <Button variant="text" size={"medium"} onClick={() => handleInvoiceClick(invoice.invoiceId)} startIcon={<InfoOutlinedIcon/>}>{t("common.details")}</Button>
                            </Stack>
                        </ListItem>
                    ))}
                    {nextPageKey &&
                        <Stack alignItems={"center"} justifyContent={"center"} width={"100%"} p={1}>
                            <Button startIcon={<ExpandMoreIcon/>} variant="text" onClick={getCustomerInvoice}>{t("common.loadMore")}</Button>
                        </Stack>}
                </List>
            </Stack>
        </Panel>
    )
}