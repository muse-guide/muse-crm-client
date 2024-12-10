import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {Box, Stack, Typography} from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import PhotoIcon from "@mui/icons-material/Photo";
import {assetService} from "../../services/AssetService";
import {useTranslation} from "react-i18next";
import {styled} from "@mui/material/styles";

interface QrCodeDialogProps {
    referenceName: string,
    resourceId: string,
    open: boolean,
    handleClose: () => any | Promise<any>
}

const Image = styled("img")({
    width: "176px",
    height: "auto",
    outline: 0,
});

export default function QrCodeDialog(props: QrCodeDialogProps) {
    const {t} = useTranslation();
    const [qrCode, setQrCode] = useState<string | undefined>(undefined);

    const getQrCodeImageAsync = useCallback(async (key: string) => {
        const response = await assetService.getAssetPreSignedUrl({assetId: key, assetType: "qrcodes"});
        setQrCode(response.url)
    }, []);

    // const download = async (url: string | undefined) => {
    //     if (!url) return
    //     const qrCodeBlob = await assetService.downloadQrCode(url)
    //     const blobURL = URL.createObjectURL(qrCodeBlob);
    //
    //     const element = document.createElement("a");
    //     element.href = blobURL;
    //     element.download = `${props.referenceName}.png`;
    //     element.click();
    // };

    useEffect(() => {
        if (props.open && !qrCode) {
            getQrCodeImageAsync(props.resourceId);
        }
    }, [props.open, qrCode, getQrCodeImageAsync]);

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
        >
            <DialogTitle fontSize="large" fontWeight="bold" sx={{pt: 3}}>
                <Stack pb={1} direction={"row"} alignItems={"center"} gap={1}>
                    <QrCode2Icon/>
                    {t("dialog.qrCode.title")}
                </Stack>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t("dialog.qrCode.description")}
                </DialogContentText>
                <Box pt={2} justifyItems={"center"}>
                    <Typography fontWeight={"normal"}>
                        {t("dialog.qrCode.referenceName", {referenceName: props.referenceName})}
                    </Typography>
                </Box>

                <Box justifyContent="center" display="flex" pb={3} pt={1}>
                    <Box
                        sx={{
                            width: 180,
                            height: 180,
                            border: 1,
                            borderStyle: "dashed",
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex"
                        }}>
                        <Image src={qrCode}></Image>
                        {!qrCode && <QrCode2Icon color="disabled" sx={{fontSize: "80px"}}/>}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{px: '24px', pb: '20px'}}>
                <Stack direction="row" spacing={2} display="flex" justifyContent="center" pb={1}>
                    <Button
                        variant="contained"
                        disableElevation
                        startIcon={<PhotoIcon fontSize='medium'/>}
                        // onClick={() => download(props.qrCodeUrl)}
                    >
                        {t("dialog.qrCode.downloadPng")}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}