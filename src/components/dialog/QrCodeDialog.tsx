import * as React from "react";
import {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {Box, Stack} from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import PhotoIcon from "@mui/icons-material/Photo";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CropIcon from "@mui/icons-material/Crop";
import {getUrl} from 'aws-amplify/storage';

interface QrCodeDialogProps {
    referenceName: string,
    qrCodeUrl: string,
    open: boolean,
    handleClose: () => any | Promise<any>
}


export default function QrCodeDialog(props: QrCodeDialogProps) {
    const [qrCode, setQrCode] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (props.open && !qrCode) getImageAsync(props.qrCodeUrl)
    }, [props.open]);

    const getImageAsync = async (key: string) => {
        const qrCode = await getUrl({
            key: key,
            options: {
                accessLevel: "private",
                validateObjectExistence: true,
            }
        });
        const url = qrCode.url.toString()
        setQrCode(url)
    };

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
        >
            <DialogTitle fontSize="large" fontWeight="bold" sx={{pt: 3}}>
                {props.referenceName}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Unikalny kod QR służący do przeniesienia Zwiedzającego na stronę wystawy. Wybierz jedną z dostępnych opcji aby go wybrukować i umieścić w widocznym miejscu."
                </DialogContentText>

                <Box justifyContent="center" display="flex" pb={3} pt={4}>
                    <Box
                        sx={{
                            width: 280,
                            height: 280,
                            border: 1,
                            borderStyle: "dashed",
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex"
                        }}>
                        <img src={qrCode}></img>
                        <QrCode2Icon color="disabled" sx={{fontSize: "80px"}}/>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{px: '24px', pb: '20px'}}>
                <Stack direction="row" spacing={2} display="flex" justifyContent="center" pb={1}>
                    <Button variant="outlined" startIcon={<PhotoIcon fontSize='medium'/>}>png</Button>
                    <Button variant="outlined" startIcon={<PictureAsPdfIcon fontSize='medium'/>}>pdf</Button>
                    <Button variant="outlined" startIcon={<CropIcon fontSize='medium'/>}>Dopasuj</Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}