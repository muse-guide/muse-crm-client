import React from 'react';
import {Button, Stack, Typography, useTheme} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import {useTranslation} from 'react-i18next';
import useDialog from "../../components/hooks";
import {EmptyPlaceholder} from "../page";

export const ArticleButton = ({onClick}: { onClick: () => void }) => {
    const {t} = useTranslation();

    return (
        <Stack direction={"row"} gap={2} alignItems={"center"}>
            <Button variant="contained" onClick={onClick} startIcon={<DescriptionIcon/>} disableElevation>{t("common.article")}</Button>
            <Typography variant='body1'>{t("page.common.articleHelperText")}</Typography>
        </Stack>
    )
}

export const NoArticlePlaceholder = ({onClick}: { onClick: () => void }) => {
    const {t} = useTranslation();
    const theme = useTheme()

    return (
        <EmptyPlaceholder>
            <Typography variant='body1' fontWeight='bolder'>{t("page.common.noArticleHelperTextTitle")}</Typography>
            <Typography sx={{color: theme.palette.text.secondary, paddingBottom: 2}} variant='subtitle2' align={"center"}>
                {t("page.common.noArticleHelperTextSubtitle")}
            </Typography>
            <Button startIcon={<DescriptionIcon/>} variant="outlined" onClick={onClick}>{t("page.common.createArticle")}</Button>
        </EmptyPlaceholder>
    )
}