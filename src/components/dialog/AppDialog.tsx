import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import {useTranslation} from "react-i18next";
import {Stack, Typography, useTheme} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import DialogContentText from "@mui/material/DialogContentText";
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import WifiIcon from '@mui/icons-material/Wifi';
import Battery80Icon from '@mui/icons-material/Battery80';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Looks3OutlinedIcon from '@mui/icons-material/Looks3Outlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

interface AooDialogProps {
    referenceName: string,
    path: string,
    open: boolean,
    handleClose: () => any | Promise<any>
}


export default function AppDialog(props: AooDialogProps) {
    const {t} = useTranslation();
    const theme = useTheme();

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
        >
            <DialogTitle fontSize="large" fontWeight="bold" sx={{pt: 3}}>
                <Stack pb={1} direction={"row"} alignItems={"center"} gap={1}>
                    <PhoneIphoneIcon/>
                    {t("dialog.app.title")}
                </Stack>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t("dialog.app.description")}
                </DialogContentText>
                <Stack alignItems={"center"} width={"auto"} m={6}>
                    <Stack alignItems={"center"} p={1} sx={{
                        borderRadius: 4,
                        boxShadow: 8,
                        backgroundColor: 'black',
                    }}>
                        <Stack gap={1} pb={2} height={"104px"} sx={{
                            backgroundColor: 'white',
                            borderTopLeftRadius: 14,
                            borderTopRightRadius: 14,
                            borderBottom: 1,
                            borderColor: theme.palette.grey["300"],
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <Stack
                                direction={"row"}
                                alignItems={"center"}
                                width={"100%"}
                                justifyContent={"space-between"}
                                py={1} px={2}
                                gap={1}
                                border={0}
                            >
                                <Typography fontWeight={"bold"}>10:00</Typography>
                                <Stack direction={"row"} gap={1}>
                                    <SignalCellularAltIcon/>
                                    <WifiIcon/>
                                    <Battery80Icon/>
                                </Stack>
                            </Stack>
                            <Stack width={"100%"} alignItems={"center"} px={2}>
                                <Stack
                                    border={0}
                                    borderRadius={12}
                                    p={1}
                                    width={"100%"}
                                    alignItems={"center"}
                                    sx={{
                                        backgroundColor: theme.palette.grey["200"]
                                    }}
                                >
                                    muse.cloud
                                </Stack>
                            </Stack>
                        </Stack>

                        <iframe
                            style={{border: 0}}
                            src={`https://duz68kh4juaad.cloudfront.net/${props.path}`}
                            width={390}
                            height={660}
                        />

                        <Stack width={"100%"} gap={2} height={"80px"} sx={{
                            backgroundColor: 'white',
                            border: 0,
                            borderTop: 1,
                            borderColor: theme.palette.grey["300"],
                            borderBottomLeftRadius: 14,
                            borderBottomRightRadius: 14
                        }}>
                            <Stack color={theme.palette.grey["600"]} direction={"row"} width={"100%"} justifyContent={"space-between"} py={1} px={2}>
                                <KeyboardArrowLeftIcon fontSize={"large"}/>
                                <KeyboardArrowRightIcon fontSize={"large"}/>
                                <AddCircleOutlineIcon fontSize={"large"}/>
                                <Looks3OutlinedIcon fontSize={"large"}/>
                                <MoreHorizOutlinedIcon fontSize={"large"}/>
                            </Stack>
                            <Stack width={"100%"} alignItems={"center"} px={2} pb={1}>
                                <Stack width={"140px"} height={"6px"} borderRadius={12} sx={{
                                    backgroundColor: theme.palette.grey["800"]
                                }}/>
                            </Stack>
                        </Stack>

                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}