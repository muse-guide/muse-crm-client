import React from 'react';
import {Button, Stack, Typography, useTheme} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import {useTranslation} from 'react-i18next';
import useDialog from "../../components/hooks";
import {EmptyPlaceholder} from "../page";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export const AudioButton = ({onClick}: { onClick: () => void }) => {
    const {t} = useTranslation();

    return (
        <Stack direction={"row"} gap={2} alignItems={"center"}>
            <Button variant="contained" onClick={onClick} startIcon={<PlayCircleIcon/>} disableElevation>{t("common.audio")}</Button>
            <Typography variant='body1'>{t("page.common.audioHelperText")}</Typography>
        </Stack>
    )
}

export const NoAudioPlaceholder = ({onClick}: { onClick: () => void }) => {
    const {t} = useTranslation();
    const theme = useTheme()

    return (
        <EmptyPlaceholder>
            <Typography variant='body1' fontWeight='bolder'>{t("page.common.noAudioHelperTextTitle")}</Typography>
            <Typography sx={{color: theme.palette.text.secondary, paddingBottom: 2}} variant='subtitle2' align={"center"}>{t("page.common.noAudioHelperTextSubtitle")}</Typography>
            <Button startIcon={<PlayArrowIcon/>} variant="outlined" onClick={onClick} sx={{paddingTop: 1}}>{t("page.common.generateAudio")}</Button>
        </EmptyPlaceholder>
    )
}