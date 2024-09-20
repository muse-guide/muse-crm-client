import {Chip, useTheme} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";

export const InvoiceStatusChip = ({status}: { status?: string }) => {
    const {t} = useTranslation()
    const theme = useTheme()

    switch (status) {
        case "PAID":
            return <Chip label={t('page.account.invoices.paid')} size="small" variant="filled" sx={{backgroundColor: theme.palette.success.light}}/>
        case "OVERDUE":
            return <Chip label={t('page.account.invoices.overdue')} size="small" variant="filled" sx={{backgroundColor: theme.palette.error.light}}/>
        case "ISSUED":
            return <Chip label={t('page.account.invoices.issued')} size="small" variant="filled" sx={{backgroundColor: theme.palette.info.light}}/>
        default:
            return <Chip label={t('common.error')} size="small" variant="filled" sx={{backgroundColor: theme.palette.error.light}}/>
    }
}