import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Divider, Grid2, Skeleton, Stack, Typography} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ReceiptIcon from '@mui/icons-material/Receipt';
import {InvoiceDetails} from "../../model/invoice";
import {invoiceService} from "../../services/InvoiceService";
import {useSnackbar} from "notistack";
import {InvoiceStatusChip} from "./InvoiceStatusChip";

export const InvoiceDialog = (props: {
    invoiceId?: string
    open: boolean,
    handleClose: () => any | Promise<any>
}) => {
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false);
    const [invoice, setInvoice] = useState<InvoiceDetails>();

    useEffect(() => {
        if (!props.invoiceId) return
        fetchInvoiceDetails(props.invoiceId)
    }, [props.invoiceId])

    const fetchInvoiceDetails = async (invoiceId: string) => {
        setLoading(true);
        try {
            const invoice = await invoiceService.getInvoice(invoiceId);
            setInvoice(invoice);
        } catch (err) {
            snackbar(t("error.fetchingInvoiceFailed"), {variant: "error"})
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog
            maxWidth={"md"}
            open={props.open}
            onClose={props.handleClose}
        >
            <DialogTitle fontSize="large" fontWeight="bold" sx={{pt: 3}}>
                <Stack pb={1} direction={"row"} alignItems={"center"} gap={1}>
                    <ReceiptIcon/>
                    {t("dialog.invoice.title")}
                </Stack>
            </DialogTitle>
            <DialogContent dividers={false}>
                {loading
                    ? <Stack minWidth="600px">
                        <Skeleton variant="rectangular" height="300px"/>
                    </Stack>
                    : <DialogContentText>
                        <Stack minWidth="600px" gap={3}>
                            <Stack gap={1}>
                                <Stack direction={"row"} gap={2} alignItems="baseline">
                                    <Typography minWidth={150} variant={"body1"}>{t("dialog.invoice.invoiceBusinessId")}:</Typography>
                                    <Typography variant={"body1"} fontWeight={"bold"}>{invoice?.invoiceBusinessId}</Typography>
                                </Stack>
                                <Stack direction={"row"} gap={2} alignItems="baseline">
                                    <Typography minWidth={150} variant={"body1"}>{t("dialog.invoice.issuedAt")}:</Typography>
                                    <Typography variant={"body1"} fontWeight={"bold"}>{invoice?.issuedAt}</Typography>
                                </Stack>
                                <Stack direction={"row"} gap={2} alignItems="baseline">
                                    <Typography minWidth={150} variant={"body1"}>{t("dialog.invoice.invoicePeriod")}:</Typography>
                                    <Typography variant={"body1"} fontWeight={"bold"}>{invoice?.periodStart} - {invoice?.periodEnd}</Typography>
                                </Stack>
                                <Stack direction={"row"} gap={2} alignItems="baseline">
                                    <Typography minWidth={150} variant={"body1"}>{t("dialog.invoice.paymentDue")}:</Typography>
                                    <Typography variant={"body1"} fontWeight={"bold"}>{invoice?.paymentDue}</Typography>
                                </Stack>
                                <Stack direction={"row"} gap={2} alignItems="baseline">
                                    <Typography minWidth={150} variant={"body1"}>{t("dialog.invoice.paymentStatus")}:</Typography>
                                    <InvoiceStatusChip status={invoice?.status}/>
                                </Stack>
                            </Stack>
                            <Divider/>
                            <Stack width="100%" gap={1}>
                                <Grid2 container>
                                    <Grid2 size={{xs: 3}}>
                                        <Typography fontWeight="bold">{t("dialog.invoice.plan")}</Typography>
                                    </Grid2>
                                    <Grid2 size={{xs: 3}}>
                                        <Typography fontWeight="bold">{t("dialog.invoice.activeFrom")}</Typography>
                                    </Grid2>
                                    <Grid2 size={{xs: 3}}>
                                        <Typography fontWeight="bold">{t("dialog.invoice.activeTo")}</Typography>
                                    </Grid2>
                                    <Grid2 size={{xs: 3}}>
                                        <Typography fontWeight="bold">{t("dialog.invoice.amount")}</Typography>
                                    </Grid2>
                                </Grid2>
                                <Stack width="100%" gap={1}>
                                    {invoice?.invoiceItems.map((item, index) => (
                                        <Grid2 container key={index}>
                                            <Grid2 size={{xs: 3}}>
                                                <Typography>{item.plan}</Typography>
                                            </Grid2>
                                            <Grid2 size={{xs: 3}}>
                                                <Typography>{item.activeFrom}</Typography>
                                            </Grid2>
                                            <Grid2 size={{xs: 3}}>
                                                <Typography>{item.activeTo}</Typography>
                                            </Grid2>
                                            <Grid2 size={{xs: 3}}>
                                                <Typography>{item.amount}zł</Typography>
                                            </Grid2>
                                        </Grid2>
                                    ))}
                                </Stack>
                            </Stack>
                            <Divider/>
                            <Stack direction="row" gap={1}>
                                <Typography fontWeight="bold">{t("dialog.invoice.totalAmount")}:</Typography>
                                <Typography>{invoice?.amount}zł</Typography>
                            </Stack>
                        </Stack>
                    </DialogContentText>
                }
            </DialogContent>
            <DialogActions sx={{px: '24px', pb: '20px'}}>
                <Stack direction={"row"} gap={1}>
                    <Button variant="outlined" onClick={props.handleClose} disableElevation>{t("common.close")}</Button>
                    <Button variant="contained" disabled startIcon={<PictureAsPdfIcon/>} disableElevation>{t("common.download")}</Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}