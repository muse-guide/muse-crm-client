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
import {ImageRef} from "../../model/common";
import {ImageListType} from "react-images-uploading";
import {assetService} from "../../services/AssetService";

const MAX_LENGTH = 2000;

export const ArticleDialog = (props: {
    markup: string | undefined,
    open: boolean,
    handleClose: () => any | Promise<any>
    handleSave: (markup: string | undefined) => any | Promise<any>
}) => {
    const [markup, setMarkup] = useState("");
    const [images, setImages] = useState<ImageRef[]>([]);
    const {t} = useTranslation();

    useEffect(() => {
        setMarkup(props.markup ?? "")
    }, [props])

    const handleMarkupChange = useCallback((content: string) => {
        setMarkup(content)
    }, []);

    const addImage = (image: ImageRef) => {
        setImages([...images, image])
    };

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
                        addImage={addImage}
                        images={images}
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