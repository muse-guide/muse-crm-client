import {useTranslation} from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {Stack} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import React from "react";
import {AccountSettings} from "@aws-amplify/ui-react";
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import DialogContentText from "@mui/material/DialogContentText";
import {useSnackbar} from "notistack";

export const ChangePasswordDialog = (props: {
    open: boolean,
    handleClose: () => any | Promise<any>
}) => {
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();

    const handleSuccess = () => {
        snackbar(t("success.passwordChanged"), {variant: "success"})
        props.handleClose()
    }

    return (
        <Dialog
            maxWidth={"sm"}
            open={props.open}
            onClose={props.handleClose}
        >
            <DialogTitle fontSize="large" fontWeight="bold" sx={{pt: 3}}>
                <Stack pb={1} direction={"row"} alignItems={"center"} gap={2}>
                    <LockResetOutlinedIcon/>
                    {t("dialog.changePassword.title")}
                </Stack>
            </DialogTitle>
            <DialogContent dividers={false}>
                <Stack gap={4} minWidth="400px">
                    <DialogContentText>
                        {t("dialog.changePassword.description")}
                    </DialogContentText>
                    <AccountSettings.ChangePassword
                        displayText={{
                            currentPasswordFieldLabel: t('dialog.changePassword.currentPasswordFieldLabel'),
                            newPasswordFieldLabel: t('dialog.changePassword.newPasswordFieldLabel'),
                            confirmPasswordFieldLabel: t('dialog.changePassword.confirmPasswordFieldLabel'),
                            updatePasswordButtonText: t('dialog.changePassword.updatePasswordButtonText'),
                        }}
                        onSuccess={handleSuccess}
                    />
                </Stack>
            </DialogContent>
        </Dialog>
    )
}