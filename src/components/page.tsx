import {Box, Button, Grid2Props, Stack, SxProps, TextField, Theme, Typography, useTheme} from "@mui/material";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

interface PageTitleProps {
    title: string,
    subtitle?: string,
    sx?: SxProps<Theme>
}

export const PageTitle = (props: PageTitleProps) => {
    return (
        <Stack sx={props.sx} spacing={0} pt={5} pb={4}>
            <Typography variant='h4' fontWeight='bolder'>{props.title}</Typography>
            {props.subtitle && <Typography variant={'body1'}>{props.subtitle}</Typography>}
        </Stack>
    )
}

export const PageContentContainer = ({children, ...props}: Grid2Props) => {
    return (
        <Grid container spacing={4} width="100%" {...props}>{children}</Grid>
    )
}

export const SinglePageColumn = ({children, ...props}: Grid2Props) => {
    return (
        <Grid xs={12} xl={8} minWidth="540px" maxWidth="1100px" width={{ xs: "100%", xl: "100%" }} {...props}>
            <Stack spacing={4} width="100%">
                {children}
            </Stack>
        </Grid>
    )
}

export const PrimaryPageColumn = ({children, ...props}: Grid2Props) => {
    return (
        <Grid xs={12} xl={6.5} minWidth="540px" maxWidth="900px" width={'100%'}  {...props}>
            <Stack spacing={4}>
                {children}
            </Stack>
        </Grid>
    )
}

export const SecondaryPageColumn = ({children, ...props}: Grid2Props) => {
    return (
        <Grid xs={12} xl={4.5} minWidth="200px" maxWidth="900px" {...props}>
            <Stack spacing={4}>
                {children}
            </Stack>
        </Grid>
    )
}

export const Actions = ({children, ...props}: Grid2Props) => {
    return (
        <Grid xs={12} xl={8} minWidth="540px" maxWidth="1100px" width={{ xs: "100%", xl: "100%" }} {...props}>
            <Stack direction="row" spacing={1} display="flex" justifyContent="end" pb={4}>
                {children}
            </Stack>
        </Grid>
    )
}

export const EmptyPlaceholder = ({children}: { children: React.ReactNode }) => {
    const theme = useTheme()

    return (
        <Box width={"100%"} sx={{
            alignItems: "center",
            height: "200px",
            border: 1,
            borderStyle: "dashed",
            borderColor: theme.palette.grey[600],
            borderRadius: `${theme.shape.borderRadius}px`,
            backgroundColor: theme.palette.grey[50],
        }}>
            <Stack alignItems="center" spacing={0} p={3} height="100%" justifyContent="center">
                {children}
            </Stack>
        </Box>
    )
}