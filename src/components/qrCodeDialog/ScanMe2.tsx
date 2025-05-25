import React, {forwardRef} from "react";
import {Stack, Typography} from "@mui/material";
import {Image} from "./QrCodeDialog";
import HeadsetIcon from '@mui/icons-material/Headset';

export const ScanMe2 = forwardRef(
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
                    backgroundColor: 'white',
                    borderColor: 'black',
                    // border: '4px solid',
                    borderRadius: '16px',
                    height: "auto",
                }}
            >
                <Image src={imageUrl} crossOrigin="anonymous"/>
                <Stack
                    display={"flex"}
                    justifyContent={'center'}
                    alignItems={'center'}
                    direction={'row'}
                    gap={1.5}
                    width={"100%"}
                    sx={{
                        backgroundColor: 'white',
                    }}
                >
                    <HeadsetIcon sx={{color: 'black', fontSize: '26px'}}/>
                    <Typography sx={{color: 'black', fontSize: '22px', fontWeight: 'bolder'}}>SCAN ME</Typography>
                </Stack>
            </Stack>
        );
    }
);