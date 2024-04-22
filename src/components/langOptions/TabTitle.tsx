import React, {useEffect, useState} from "react";
import {FieldError, useFormContext} from "react-hook-form";
import ConfirmationDialog from "../dialog/ConfirmationDialog";
import {Stack, Typography} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import {CircleFlag} from "react-circle-flags";
import CancelIcon from "@mui/icons-material/Cancel";
import { langMap } from "../../model/common";
import {useTranslation} from "react-i18next";

export const TabTitle = ({index, countryCode, handleRemoveLang}: { index: number, countryCode: string, handleRemoveLang: (index: number) => void }) => {
    const {t} = useTranslation();
    const [removeLangDialogOpen, setRemoveLangDialogOpen] = useState(false);
    const [containError, setContainError] = useState(false);
    const {formState: {errors, isSubmitting, isValidating}} = useFormContext()

    useEffect(() => {
        const errorsArray = errors?.langOptions as unknown as FieldError[]
        if (errorsArray?.length > 0 && errorsArray[index]) setContainError(true)
        else setContainError(false)
    }, [errors, index, isSubmitting, isValidating]);

    const handleClickOpen = () => {
        setRemoveLangDialogOpen(true);
    };

    const handleClose = () => {
        setRemoveLangDialogOpen(false);
    };

    const handleAgree = () => {
        handleRemoveLang(index)
        setRemoveLangDialogOpen(false);
    };

    return (
        <>
            <ConfirmationDialog
                title={t("dialog.removeLanguage.title")}
                description={t("dialog.removeLanguage.description")}
                open={removeLangDialogOpen}
                handleAgree={handleAgree}
                handleClose={handleClose}
            />
            <Stack direction='row' alignItems='center' px={1}>
                {containError ?
                    <ErrorIcon color="error" sx={{height: '36px', fontSize: '24px'}}/>
                    :
                    <CircleFlag countryCode={langMap.get(countryCode) ?? ""} height="24"/>
                }
                <Typography variant='body1' pl={1}>
                    {(langMap.get(countryCode) ?? "").toUpperCase()}
                </Typography>
                <CancelIcon color="disabled" fontSize='small' sx={{height: '36px', ml: 1.5}} onClick={handleClickOpen}/>
            </Stack>
        </>
    )
}