import React from "react";
import {Box, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

const ErrorPage = () => {
    const {t} = useTranslation();

    return (
        <Box width="100%" height="100svh" justifyContent="center" alignItems="center" display="flex" flexGrow={1}>
            <Typography variant={"h5"} fontWeight={"bolder"}>
                {t("oops")}
            </Typography>
        </Box>
    );
};

export default ErrorPage;
