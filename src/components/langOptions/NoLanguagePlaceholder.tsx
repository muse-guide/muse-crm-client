import {Box, Stack, Typography, useTheme} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";

export const NoLanguagePlaceholder = () => {
    const theme = useTheme()
    const {t} = useTranslation()

    return (
        <Box width={"100%"}
             sx={{
                 border: 1,
                 borderStyle: "dashed",
                 borderColor: theme.palette.grey[600],
                 backgroundColor: theme.palette.grey[50],
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "center",
             }}>
            <Box alignItems="center" display="flex" py={7}>
                <Typography sx={{color: theme.palette.text.secondary}} variant='subtitle2' align={"center"}>{t("page.common.noLanguage")}</Typography>
            </Box>
        </Box>
    )
}