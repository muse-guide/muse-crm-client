import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useTranslation} from "react-i18next";

interface ConfirmationDialogProps {
    title: string,
    description: string,
    open: boolean,
    handleAgree: () => void
    handleClose: () => void
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
    const {t} = useTranslation();

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
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
                    <Button variant="text" onClick={props.handleClose}>{t("common.no")}</Button>
                    <Button variant="contained" onClick={props.handleAgree} autoFocus>{t("common.yes")}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}