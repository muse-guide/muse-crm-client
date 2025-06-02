import React, {forwardRef} from "react";
import {Stack, Typography} from "@mui/material";
import {QrCodeImage} from "./QrCodeDialog";
import HeadsetIcon from '@mui/icons-material/Headset';

export const ScanMe2 = forwardRef(
    (
        {id, imageUrl, large, onLoad = undefined}: { id: string; imageUrl: string | undefined; large?: boolean, onLoad?: () => void },
        ref: React.Ref<any>
    ) => {
        const width = large ? "600px" : "150px";
        const height = large ? "600px" : "150px";
        const fontSize = large ? '72px' : '18px';
        const iconSize = large ? '96px' : '24px';

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
                    borderRadius: large ? '96px' : '16px',
                    height: "auto",
                }}
            >
                {imageUrl
                    ? <QrCodeImage
                        src={imageUrl}
                        width={width}
                        height={height}
                        borderRadius={large ? '32px' : '8px' }
                        crossOrigin="anonymous"
                        onLoad={onLoad}
                    />
                    : large ? null : <QrCodeImage width={width} height={height} src={"/image_loading.png"}/>
                }
                <Stack
                    display={"flex"}
                    justifyContent={'center'}
                    alignItems={'center'}
                    direction={'row'}
                    gap={large ? 6 : 1.5}
                    pb={large ? 4 : 1}
                    borderRadius={large ? '32px' : '16px'}
                    width={"100%"}
                    sx={{
                        backgroundColor: 'white',
                    }}
                >
                    <HeadsetIcon sx={{color: 'black', fontSize: iconSize}}/>
                    <Typography sx={{color: 'black', fontSize: fontSize, fontWeight: 'bolder'}}>SCAN ME</Typography>
                </Stack>
            </Stack>
        );
    }
);