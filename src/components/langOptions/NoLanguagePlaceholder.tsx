import {Box, Stack, Typography, useTheme} from "@mui/material";
import React from "react";

export const NoLanguagePlaceholder = () => {
    const theme = useTheme()
    return (
        <Box width={"100%"}
             sx={{
                 border: 1,
                 borderStyle: "dashed",
                 borderColor: theme.palette.grey[600],
                 backgroundColor: theme.palette.grey[50]
             }}>
            <Stack alignItems="center" spacing={0} py={7}>
                <Typography sx={{color: theme.palette.text.secondary, paddingBottom: 2}} variant='subtitle2'>Dodaj język w jakim będzie dostępny element</Typography>
            </Stack>
        </Box>
    )
}