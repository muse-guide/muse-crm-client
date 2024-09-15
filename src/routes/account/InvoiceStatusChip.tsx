import {Chip} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";

export const InvoiceStatusChip = ({status}: { status?: string }) => {
    const {t} = useTranslation()

    switch (status) {
        case "PAID":
            return <Chip label={t('page.account.invoices.paid')} size="small" variant="outlined" color="success"/>
        case "OVERDUE":
            return <Chip label={t('page.account.invoices.unpaid')} size="small" variant="outlined" color="error"/>
        case "ISSUED":
            return <Chip label={t('page.account.invoices.issued')} size="small" variant="outlined" color="info"/>
        default:
            return <Chip label={t('common.error')} size="small" variant="outlined" color="error"/>
    }
}