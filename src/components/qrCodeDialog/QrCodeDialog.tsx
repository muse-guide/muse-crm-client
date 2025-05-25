import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
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
import {ScanMe1} from "./ScanMe1";
import {ScanMe2} from "./ScanMe2";
import * as htmlToImage from 'html-to-image';
import download from "downloadjs";
import {ScanMe3} from "./ScanMe3";

interface QrCodeDialogProps {
    referenceName: string,
    resourceId: string,
    open: boolean,
    handleClose: () => any | Promise<any>
}

export const Image = styled("img")({
    width: "176px",
    height: "176px",
    outline: 0,
    borderRadius: "8px",
});

export default function QrCodeDialog(props: QrCodeDialogProps) {
    const {t} = useTranslation();
    const [qrCode, setQrCode] = useState<string | undefined>(undefined);
    const scanMe1Ref = useRef(null);
    const scanMe2Ref = useRef(null);
    const scanMe3Ref = useRef(null);

    const getQrCodeImageAsync = useCallback(async (key: string) => {
        const response = await assetService.getAssetPreSignedUrl({assetId: key, assetType: "qrcodes"});
        setQrCode(response.url)
    }, []);

    useEffect(() => {
        if (props.open && !qrCode) {
            getQrCodeImageAsync(props.resourceId);
        }
    }, [props.open, qrCode, getQrCodeImageAsync]);

    const downloadQrCode = async () => {
        htmlToImage
            .toPng(document.getElementById('scan-me-1') as HTMLElement, {skipFonts: true,})
            .then((dataUrl) => {
                download(dataUrl, `${props.referenceName}.png`)
            });
    }

    return (
        <Dialog
            maxWidth={"md"}
            open={props.open}
            onClose={props.handleClose}
        >
            <DialogTitle fontSize="large" fontWeight="bold" sx={{pt: 3}}>
                <Stack pb={1} direction={"row"} alignItems={"center"} gap={1}>
                    <QrCode2Icon/>
                    {t("dialog.qrCode.title")} - {props.referenceName}
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

                <Stack
                    justifyContent="center"
                    display="flex"
                    direction="row"
                    pb={3} pt={3} gap={2}
                    alignItems="center"
                >
                    <QrCodeOptionWrapper qrCode={qrCode}>
                        <ScanMe1 id={'scan-me-1'} ref={scanMe1Ref} imageUrl={qrCode!!}/>
                    </QrCodeOptionWrapper>
                    <QrCodeOptionWrapper qrCode={qrCode}>
                        <ScanMe2 id={'scan-me-2'} ref={scanMe2Ref} imageUrl={qrCode!!}/>
                    </QrCodeOptionWrapper>
                    <QrCodeOptionWrapper qrCode={qrCode}>
                        <ScanMe3 id={'scan-me-3'} ref={scanMe3Ref} imageUrl={qrCode!!}></ScanMe3>
                    </QrCodeOptionWrapper>
                </Stack>
            </DialogContent>
            <DialogActions sx={{px: '24px', pb: '20px'}}>
                <Stack direction="row" spacing={2} display="flex" justifyContent="center" pb={1}>
                    <Button
                        variant="contained"
                        disableElevation
                        startIcon={<PhotoIcon fontSize='medium'/>}
                        onClick={downloadQrCode}
                    >
                        {t("dialog.qrCode.downloadPng")}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}

const QrCodeOptionWrapper = (props: {
    qrCode: string | undefined,
    children: React.ReactNode
}) => {
    return (
        <Box
            sx={{
                width: 320,
                height: 320,
                border: 1,
                borderRadius: 2,
                alignItems: "center",
                justifyContent: "center",
                display: "flex"
            }}>
            {props.qrCode
                ? props.children
                : <QrCode2Icon color="disabled" sx={{fontSize: "80px"}}/>
            }
        </Box>
    )
}