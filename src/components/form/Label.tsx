import {Stack, Typography} from "@mui/material";
import React from "react";

export const Label = ({label, value}: { label: string, value: string }) => {
    return (
        <Stack spacing={0.5}>
            <Typography variant='body1'>{label}</Typography>
            <Typography variant='body1'>{value}</Typography>
        </Stack>
    )
}