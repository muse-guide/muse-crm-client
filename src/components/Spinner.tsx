import { Box, CircularProgress } from "@mui/material";
import React from "react";

export const Spinner = () => {
    return (
        <Box
            sx={{
                height: "50svh",
                minWidth: "540px",
                maxWidth: "900px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <CircularProgress />
        </Box>
    );
};
