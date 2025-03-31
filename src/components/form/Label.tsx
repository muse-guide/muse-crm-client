import {Stack, Typography} from "@mui/material";
import React from "react";
import {grey} from "@mui/material/colors";

export const Label = ({label, value}: { label: string, value?: any }) => {
    return (
        <Stack spacing={0.5}>
            <Typography variant='body1'>{label}</Typography>
            <Typography variant='body1' sx={{color: grey[900]}}>{value}</Typography>
        </Stack>
    )
}