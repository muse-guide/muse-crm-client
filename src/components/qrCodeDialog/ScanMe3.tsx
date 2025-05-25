import React, {forwardRef} from "react";
import {Stack, Typography} from "@mui/material";
import {Image} from "./QrCodeDialog";
import HeadsetIcon from '@mui/icons-material/Headset';

export const ScanMe3 = forwardRef(
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
                    borderRadius: '16px',
                    height: "auto",
                }}
            >
                <Image src={imageUrl} crossOrigin="anonymous"/>
            </Stack>
        );
    }
);