import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {Panel} from "../../components/panel";
import {Button, Chip, List, ListItem, ListItemText, Stack, Typography} from "@mui/material";
import {AppContext} from "../Root";
import {InvoicePeriodSelect} from "./InvoicePeriodSelect";
import {invoiceService} from "../../services/InvoiceService";
import {Invoice} from "../../model/invoice";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useDialog from "../../components/hooks";
import {InvoiceDialog} from "./InvoiceDialog";
import {InvoiceStatusChip} from "./InvoiceStatusChip";

export const InvoicesPanel = () => {
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const invoiceDialog = useDialog()

    const applicationContext = useContext(AppContext);
    const invoicePeriods = applicationContext?.configuration?.invoicePeriods ?? [];
    const [loading, setLoading] = useState<boolean>(false);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [invoiceId, setInvoiceId] = useState<string | undefined>(undefined);

    const currentInvoicePeriodEnd = applicationContext?.configuration.currentInvoicePeriod
    const [invoicePeriodStart, setInvoicePeriodStart] = useState<string>(currentInvoicePeriodEnd?.periodStart ?? "");
    const [invoicePeriodEnd, setInvoicePeriodEnd] = useState<string>(currentInvoicePeriodEnd?.periodEnd ?? "");

    useEffect(() => {
        getCustomerInvoice();
    }, [invoicePeriodStart, invoicePeriodEnd]);

    const getCustomerInvoice = async () => {
        setLoading(true);
        try {
            const results = await invoiceService.getCustomerInvoicesForPeriod(invoicePeriodStart, invoicePeriodEnd);
            setInvoices(results)
        } catch (err) {
            snackbar(t("error.fetchingInvoicesFailed"), {variant: "error"})
        } finally {
            setLoading(false);
        }
    }

    const onChangeInvoicePeriodStart = (value: string) => {
        if (value > invoicePeriodEnd) {
            setInvoicePeriodEnd(value);
        }
        setInvoicePeriodStart(value);
    }

    const onChangeInvoicePeriodEnd = (value: string) => {
        if (value < invoicePeriodStart) {
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
                    <InvoicePeriodSelect
                        label={t('common.from')}
                        values={invoicePeriods.map(period => period.periodStart)}
                        value={invoicePeriodStart}
                        onChange={onChangeInvoicePeriodStart}
                    />
                    <InvoicePeriodSelect
                        label={t('common.to')}
                        values={invoicePeriods.map(period => period.periodEnd)}
                        value={invoicePeriodEnd}
                        onChange={onChangeInvoicePeriodEnd}
                    />
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