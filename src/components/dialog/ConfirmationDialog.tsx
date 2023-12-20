import * as React from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useTranslation} from "react-i18next";
import LoadingButton from "@mui/lab/LoadingButton";

interface ConfirmationDialogProps {
    title: string,
    description: string,
    open: boolean,
    handleAgree: () => any | Promise<any>,
    handleClose: () => any | Promise<any>
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
    const {t} = useTranslation();
    const [processing, setProcessing] = useState<boolean>(false)

    const handleAgree = async () => {
        setProcessing(true)
        await props.handleAgree()
        setProcessing(false)
    }

    return (
        <Dialog
            open={props.open}
            disableEscapeKeyDown
        >
            <DialogTitle fontSize="large" fontWeight="bold" sx={{pt: 3}}>
                {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.description}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{px: '24px', pb: '20px'}}>
                <Button variant="text" disabled={processing} onClick={props.handleClose}>{t("common.no")}</Button>
                <LoadingButton
                    variant="contained"
                    disableElevation
                    type="submit"
                    loading={processing}
                    onClick={handleAgree}
                >
                    {t("common.yes")}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}