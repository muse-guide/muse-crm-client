import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {Panel} from "../../components/panel";
import {Avatar, Button, FormControl, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, SelectChangeEvent, Stack, Typography, useTheme} from "@mui/material";
import {AppContext} from "../Root";
import {Invoice} from "../../model/invoice";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useDialog from "../../components/hooks";
import {InvoiceDialog} from "./InvoiceDialog";
import {InvoiceStatusChip} from "./InvoiceStatusChip";
import dayjs, {Dayjs} from "dayjs";
import {invoiceService} from "../../services/InvoiceService";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {grey} from "@mui/material/colors";
import CircleIcon from '@mui/icons-material/Circle';

type InvoiceStatusTypes = "all" | "paid" | "unpaid"

export const InvoicesPanel = () => {
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const invoiceDialog = useDialog()
    const theme = useTheme()

    const applicationContext = useContext(AppContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [invoiceId, setInvoiceId] = useState<string | undefined>(undefined);
    const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatusTypes>("all");

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
                <FormControl>
                    <Select
                        value={invoiceStatus}
                        onChange={(event: SelectChangeEvent) => setInvoiceStatus(event.target.value as InvoiceStatusTypes)}
                        size={"small"}
                        sx={{
                            minWidth: "100px",
                            height: "36px",
                            color: grey[500],
                        }}
                    >
                        <MenuItem value={'all'}>
                            <Stack direction={"row"} gap={1} alignItems={"center"} fontSize={"14px"}>
                                <CircleIcon sx={{color: theme.palette.info.dark}} fontSize={"inherit"}/>
                                <Typography variant={"button"}>{t('page.account.invoices.all')}</Typography>
                            </Stack>
                        </MenuItem>
                        <MenuItem value={'paid'}>
                            <Stack direction={"row"} gap={1} alignItems={"center"} fontSize={"14px"}>
                                <CircleIcon sx={{color: theme.palette.success.dark}} fontSize={"inherit"}/>
                                <Typography variant={"button"}>{t('page.account.invoices.paid')}</Typography>
                            </Stack>
                        </MenuItem>
                        <MenuItem value={'unpaid'}>
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
                                <InvoiceStatusChip status={invoice.status}/>
                                <Stack direction="row" mx={5} gap={2} alignItems="center">
                                    <Typography variant={"body1"} fontWeight="">{t("Total")}:</Typography>
                                    <Typography variant={"body1"} sx={{fontWeight: 700}}>{invoice.amount}zł</Typography>
                                </Stack>
                                <Button variant="text" size={"medium"} onClick={() => handleInvoiceClick(invoice.invoiceId)} startIcon={<InfoOutlinedIcon/>}>{t("common.details")}</Button>
                            </Stack>
                        </ListItem>
                    ))}
                </List>
            </Stack>
        </Panel>
    )
}