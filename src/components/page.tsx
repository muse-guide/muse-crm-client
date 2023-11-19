import {Grid2Props, Stack, SxProps, Theme, Typography} from "@mui/material";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";

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
        <Grid container spacing={4} {...props}>{children}</Grid>
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
        <Grid xs={12} xl={6.5} minWidth="540px" maxWidth="900px" {...props}>
            <Stack direction="row" spacing={1} display="flex" justifyContent="end" pb={4}>
                {children}
            </Stack>
        </Grid>
    )
}