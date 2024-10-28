import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Stack} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import SaveIcon from "@mui/icons-material/Save";
import {ArticleEditor} from "./ArticleEditor";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

export const ArticleDialog = (props: {
    article?: string
    open: boolean,
    handleClose: () => any | Promise<any>
    handleSave: (article?: string) => any | Promise<any>
}) => {
    const [markup, setMarkup] = useState("");
    const {t} = useTranslation();

    useEffect(() => {
        setMarkup(props.article ?? "")
    }, [props])

    const handleMarkupChange = useCallback((content: string) => {
        setMarkup(content)
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
                    <DescriptionOutlinedIcon/>
                    {t("dialog.article.title")}
                </Stack>
            </DialogTitle>
            <DialogContent dividers={false}>
                <DialogContentText>
                    {t("dialog.article.description")}
                </DialogContentText>
                <Stack pt={3}>
                    <ArticleEditor
                        content={markup}
                        onContentChange={handleMarkupChange}
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