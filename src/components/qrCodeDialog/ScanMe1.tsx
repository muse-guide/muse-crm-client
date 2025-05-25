import React, {forwardRef} from "react";
import {Stack, Typography} from "@mui/material";
import {Image} from "./QrCodeDialog";
import HeadsetIcon from '@mui/icons-material/Headset';

export const ScanMe1 = forwardRef(
    (
        {id, imageUrl}: { id: string; imageUrl: string },
        ref: React.Ref<any>
    ) => {
        return (
            <Stack
                id={id}
                ref={ref}
                display="flex"
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                    backgroundColor: 'black',
                    border: '12px solid',
                    borderRadius: '16px',
                    height: "auto",
                }}
            >
                <Image src={imageUrl} crossOrigin="anonymous"/>
                <Stack
                    display={"flex"}
                    justifyContent={'center'}
                    alignItems={'center'}
                    pt={1}
                    pb={0}
                    direction={'row'}
                    gap={1.5}
                    width={"100%"}
                    sx={{
                        backgroundColor: 'black',
                    }}
                >
                    <HeadsetIcon sx={{color: 'white', fontSize: '28px'}}/>
                    <Typography sx={{color: 'white', fontSize: '24px', fontWeight: 'bolder'}}>SCAN ME</Typography>
                </Stack>
            </Stack>
        );
    }
);