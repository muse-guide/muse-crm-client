import {Typography, useTheme} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";
import {EmptyPlaceholder} from "../page";

export const NoLanguagePlaceholder = () => {
    const theme = useTheme()
    const {t} = useTranslation()

    return (
        <EmptyPlaceholder>
            <Typography variant='body2' align={"center"}>{t("page.common.noLanguage")}</Typography>
        </EmptyPlaceholder>
    )
}