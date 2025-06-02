import * as React from "react";
import {ReactNode, useCallback, useEffect, useRef, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {Box, Modal, Stack, Typography} from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import PhotoIcon from "@mui/icons-material/Photo";
import {assetService} from "../../services/AssetService";
import {useTranslation} from "react-i18next";
import {styled} from "@mui/material/styles";
import {ScanMe3} from "./ScanMe3";
import {ScanMe2} from "./ScanMe2";
import * as htmlToImage from 'html-to-image';
import download from "downloadjs";
import {ScanMe1} from "./ScanMe1";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PolylineIcon from '@mui/icons-material/Polyline';
import {useSnackbar} from "notistack";

interface QrCodeDialogProps {
    referenceName: string,
    resourceId: string,
    appPath: string,
    open: boolean,
    handleClose: () => any | Promise<any>
}

export const QrCodeImageSmall = styled("img")({
    width: "150px",
    height: "150px",
    borderRadius: "8px",
});

interface QrCodeImageProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    onLoad?: React.ReactEventHandler<HTMLImageElement>;
}

export const QrCodeImage = (props: QrCodeImageProps & React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
        style={{
            width: props.width ?? 600,
            height: props.height ?? 600,
            borderRadius: props.borderRadius ?? "8px",
        }}
        {...props}
     alt={"QR Code"}
    />
);

export default function QrCodeDialog(props: QrCodeDialogProps) {
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const [qrCode, setQrCode] = useState<string | undefined>(undefined);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const scanMe1Ref = useRef(null);
    const scanMe2Ref = useRef(null);
    const scanMe3Ref = useRef(null);
    const scanMe1RefLarge = useRef(null);
    const scanMe2RefLarge = useRef(null);
    const scanMe3RefLarge = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const qrOptions = [
        {id: 'scan-me-1'},
        {id: 'scan-me-2'},
        {id: 'scan-me-3'},
    ];

    const getQrCodeImageAsync = useCallback(async (key: string) => {
        const response = await assetService.getAssetPreSignedUrl({assetId: key, assetType: "qrcodes"});
        setQrCode(response.url)
    }, []);

    useEffect(() => {
        if (props.open && !qrCode) {
            getQrCodeImageAsync(props.resourceId);
        }
    }, [props.open, qrCode, getQrCodeImageAsync]);

    const downloadPng = async () => {
        htmlToImage
            .toPng(document.getElementById(`${qrOptions[selectedIndex].id}-large`) as HTMLElement, {skipFonts: false,})
            .then((dataUrl) => {
                download(dataUrl, `${props.referenceName}.png`)
            });
        setModalOpen(false);
    }

    const LargeQrCode = () => {
        switch (selectedIndex) {
            case 0:
                return <ScanMe1 id={`${qrOptions[0].id}-large`} ref={scanMe1RefLarge} imageUrl={qrCode} large={true} onLoad={downloadPng}/>;
            case 1:
                return <ScanMe2 id={`${qrOptions[1].id}-large`} ref={scanMe2RefLarge} imageUrl={qrCode} large={true} onLoad={downloadPng}/>;
            case 2:
                return <ScanMe3 id={`${qrOptions[2].id}-large`} ref={scanMe3RefLarge} imageUrl={qrCode} large={true} onLoad={downloadPng}/>;
            default:
                return null;
        }
    }

    return (
        <Dialog
            maxWidth={"md"}
            open={props.open}
            onClose={props.handleClose}
        >
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            >
                <Box sx={style}>
                    <LargeQrCode/>
                </Box>
            </Modal>
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
                <Stack pt={4} pb={3} gap={1} display={"flex"} width={"100%"} alignItems={"center"} justifyContent={"center"} direction={"row"}>
                    <Box px={2} py={1} sx={{backgroundColor: 'grey.100', borderRadius: 1}}>
                        <Typography variant="body2">
                            https://app.musee.cloud/{props.appPath}/{props.resourceId}
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        disableElevation
                        onClick={async () => {
                            await navigator.clipboard.writeText(`https://app.musee.cloud/${props.appPath}/${props.resourceId}`);
                            snackbar(t("dialog.qrCode.linkCopied"), {variant: 'success'});
                        }}
                    >
                        {t("dialog.qrCode.copyLink")}
                    </Button>
                </Stack>

                <Stack
                    justifyContent="center"
                    display="flex"
                    direction="row"
                    pb={3} pt={3} gap={2}
                    alignItems="center"
                >
                    <OptionWrapper
                        index={0}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                    >
                        <ScanMe1 id={qrOptions[0].id} ref={scanMe1Ref} imageUrl={qrCode} large={false}/>
                    </OptionWrapper>
                    <OptionWrapper
                        index={1}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                    >
                        <ScanMe2 id={qrOptions[1].id} ref={scanMe2Ref} imageUrl={qrCode}/>
                    </OptionWrapper>
                    <OptionWrapper
                        index={2}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                    >
                        <ScanMe3 id={qrOptions[2].id} ref={scanMe3Ref} imageUrl={qrCode}/>
                    </OptionWrapper>
                </Stack>
            </DialogContent>
            <DialogActions sx={{px: '24px', pb: '20px'}}>
                <Stack direction="row" spacing={1} display="flex" justifyContent="center" pb={1}>
                    <Button
                        variant="outlined"
                        disableElevation
                        onClick={props.handleClose}
                    >
                        {t("common.close")}
                    </Button>
                    <Button
                        variant="contained"
                        disableElevation
                        startIcon={<PhotoIcon fontSize='medium'/>}
                        onClick={() => setModalOpen(true)}
                    >
                        {t("dialog.qrCode.download")}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'transparent',
    boxShadow: 24,
    p: 4,
};

const OptionWrapper = (
    {
        index,
        selectedIndex,
        setSelectedIndex,
        children
    }: {
        index: number,
        selectedIndex: number,
        setSelectedIndex: (index: number) => void,
        children: ReactNode
    }) => {
    return <Box
        key={`wrapper-${index}`}
        onClick={() => setSelectedIndex(index)}
        sx={{
            cursor: 'pointer',
            border: 2,
            borderColor: selectedIndex === index ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            position: 'relative',
            width: 320,
            height: 320,
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            boxShadow: selectedIndex === index ? 4 : 0,
            transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
    >
        <Box sx={{position: 'absolute', top: 12, right: 12}}>
            {selectedIndex === index
                ? <RadioButtonCheckedIcon color="primary"/>
                : <RadioButtonUncheckedIcon color="disabled"/>}
        </Box>
        {children}
    </Box>
}