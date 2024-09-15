import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {Panel} from "../../components/panel";
import {Button, List, ListItem, ListItemText, Stack, Typography} from "@mui/material";
import {AppContext} from "../Root";
import {Invoice} from "../../model/invoice";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useDialog from "../../components/hooks";
import {InvoiceDialog} from "./InvoiceDialog";
import {InvoiceStatusChip} from "./InvoiceStatusChip";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {invoiceService} from "../../services/InvoiceService";

export const InvoicesPanel = () => {
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const invoiceDialog = useDialog()

    const applicationContext = useContext(AppContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [invoiceId, setInvoiceId] = useState<string | undefined>(undefined);

    const currentInvoicePeriod = applicationContext?.configuration.lastInvoicedPeriod
    const [invoicePeriodStart, setInvoicePeriodStart] = useState<Dayjs | null>(dayjs(currentInvoicePeriod?.periodStart || null));
    const [invoicePeriodEnd, setInvoicePeriodEnd] = useState<Dayjs | null>(dayjs(currentInvoicePeriod?.periodEnd || null));

    useEffect(() => {
        getCustomerInvoice();
    }, [invoicePeriodStart, invoicePeriodEnd]);

    const getCustomerInvoice = async () => {
        setLoading(true);
        try {
            const from = invoicePeriodStart?.format("YYYY-MM-DD") ?? "";
            const to = invoicePeriodEnd?.format("YYYY-MM-DD") ?? "";
            const results = await invoiceService.getCustomerInvoicesForPeriod(from, to);
            setInvoices(results)
        } catch (err) {
            snackbar(t("error.fetchingInvoicesFailed"), {variant: "error"})
        } finally {
            setLoading(false);
        }
    }

    const onChangeInvoicePeriodStart = (value: Dayjs | null) => {
        if (value?.isAfter(invoicePeriodEnd)) {
            setInvoicePeriodEnd(value);
        }
        setInvoicePeriodStart(value);
    }

    const onChangeInvoicePeriodEnd = (value: Dayjs | null) => {
        if (value?.isBefore(invoicePeriodStart)) {
            setInvoicePeriodStart(value);
        }
        setInvoicePeriodEnd(value);
    }

    const handleInvoiceClick = async (invoiceId: string) => {
        setInvoiceId(invoiceId);
        invoiceDialog.openDialog();
    }

    return (
        <Panel
            loading={loading}
            title={t('page.account.invoices.title')}
            subtitle={t('page.account.invoices.subtitle')}
            panelAction={
                <Stack direction={"row"} gap={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={t('common.from')}
                            value={invoicePeriodStart}
                            onChange={(newValue) => onChangeInvoicePeriodStart(newValue)}

                        />
                        <DatePicker
                            label={t('common.to')}
                            value={invoicePeriodEnd}
                            onChange={(newValue) => onChangeInvoicePeriodEnd(newValue)}

                        />
                    </LocalizationProvider>
                </Stack>
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
                            <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between" gap={2}>
                                <ListItemText primary={invoice.invoiceBusinessId} secondary={`${invoice.periodStart} - ${invoice.periodEnd}`}/>
                                <InvoiceStatusChip status={invoice.status}/>
                                <Stack direction="row" mx={5} gap={2} alignItems="center">
                                    <Typography variant={"body1"} fontWeight="">{t("Total")}:</Typography>
                                    <Typography variant={"h6"} fontWeight="bold">{invoice.amount}zł</Typography>
                                </Stack>
                                <Button variant="text" size={"medium"} onClick={() => handleInvoiceClick(invoice.invoiceId)} startIcon={<InfoOutlinedIcon/>}>{t("details")}</Button>
                            </Stack>
                        </ListItem>
                    ))}
                </List>
            </Stack>
        </Panel>
    )
}