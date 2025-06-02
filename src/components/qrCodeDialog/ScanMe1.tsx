import React, {forwardRef} from "react";
import {Stack} from "@mui/material";
import {QrCodeImage} from "./QrCodeDialog";

export const ScanMe1 = forwardRef(
    (
        {id, imageUrl, large, onLoad = undefined}: { id: string; imageUrl: string | undefined; large?: boolean, onLoad?: () => void },
        ref: React.Ref<any>
    ) => {
        const width = large ? "600px" : "150px";
        const height = large ? "600px" : "150px";

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
                    width: width,
                    height: height,
                    borderRadius: large ? '96px' : '16px',
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
            </Stack>
        );
    }
);