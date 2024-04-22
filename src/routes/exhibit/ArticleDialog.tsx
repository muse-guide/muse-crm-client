import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Stack, TextField} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import SaveIcon from "@mui/icons-material/Save";

const MAX_LENGTH = 1000;

export const ArticleDialog = (props: {
    markup: string | undefined,
    open: boolean,
    handleClose: () => any | Promise<any>
    handleSave: (markup: string | undefined) => any | Promise<any>
}) => {
    const [markup, setMarkup] = useState("");
    const [error, setError] = useState<string | undefined>();
    const {t} = useTranslation();

    useEffect(() => {
        setError(undefined)
        setMarkup(props.markup ?? "")
    }, [props])

    const handleMarkupChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setError(undefined)
        if (event.target.value.length > MAX_LENGTH) {
            setError(t("validation.maxLength", {length: MAX_LENGTH}))
        }
        setMarkup(event.target.value)
    }, []);

    const handleSaveArticle = useCallback(() => {
        if (!markup || markup.length === 0) {
            props.handleSave(undefined)
            return
        }
        props.handleSave(markup)
    }, [markup, props]);

    return (
        <Dialog
            maxWidth={"md"}
            open={props.open}
            onClose={props.handleClose}
        >
            <DialogTitle fontSize="large" fontWeight="bold" sx={{pt: 3}}>
                <Stack pb={1} direction={"row"} alignItems={"center"} gap={1}>
                    <AutoAwesomeIcon/>
                    {t("dialog.article.title")}
                </Stack>
            </DialogTitle>
            <DialogContent dividers={false}>
                <DialogContentText>
                    {t("dialog.article.description")}
                </DialogContentText>
                <Stack pt={1}>
                    <TextField
                        variant={"outlined"}
                        name={"markup"}
                        value={markup}
                        onChange={handleMarkupChange}
                        required
                        error={!!error}
                        helperText={error ?? `${markup.length}/${MAX_LENGTH}`}
                        fullWidth={true}
                        multiline={true}
                        rows={12}
                        sx={{paddingTop: 1.5}}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{px: '24px', pb: '20px'}}>
                <Stack direction={"row"} gap={1}>
                    <Button variant="outlined" onClick={props.handleClose} disableElevation>{t("common.close")}</Button>
                    <Button variant="contained" onClick={handleSaveArticle} startIcon={<SaveIcon/>} disableElevation>{t("common.save")}</Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}