import {Box, Grid2, Grid2Props, Stack, SxProps, Theme, Typography, useTheme} from "@mui/material";
import React from "react";
import {grey} from "@mui/material/colors";
import {borderColor, mainBackgroundColor} from "../index";

export const Page = ({children}: { children: React.ReactNode }) => {
    return (
        <Box display="flex" flexDirection="column" flexGrow="1" pb={4}>
            {children}
        </Box>
    )
}

interface PageTitleProps {
    title: string,
    subtitle?: string,
    sx?: SxProps<Theme>
}

export const PageTitle = (props: PageTitleProps) => {
    return (
        <Stack sx={props.sx} gap={1} pt={5} pb={4}>
            <Typography variant='h4'>{props.title}</Typography>
            {props.subtitle && <Typography variant={'body1'}>{props.subtitle}</Typography>}
        </Stack>
    )
}

export const PageContentContainer = ({children}: { children: React.ReactNode }) => {
    return (
        <Stack
            spacing={4}
            width="100%"
        >
            {children}
        </Stack>
    )
}

export const SinglePageColumn = ({children, ...props}: Grid2Props) => {
    return (
        <Grid2
            container
            size={{xs:12, xl:8}}
            minWidth="840px"
            maxWidth={props.maxWidth ?? "1024px"}
            width={"100%"}
            {...props}
        >
            <Stack gap={4} width="100%">
                {children}
            </Stack>
        </Grid2>
    )
}

export const Actions = ({children, ...props}: Grid2Props) => {
    return (
        <Grid2 size={{xs:12, xl:8}} minWidth="540px" maxWidth="840px" width={{xs: "100%", xl: "100%"}} {...props}>
            <Stack direction="row" spacing={1} display="flex" justifyContent="end" pb={4}>
                {children}
            </Stack>
        </Grid2>
    )
}

export const EmptyPlaceholder = ({children}: { children: React.ReactNode }) => {
    const theme = useTheme()

    return (
        <Box width={"100%"} sx={{
            alignItems: "center",
            height: "170px",
            border: 1,
            borderColor: borderColor,
            backgroundColor: mainBackgroundColor,
            borderRadius: `${theme.shape.borderRadius}px`,
        }}>
            <Stack alignItems="center" spacing={0} p={3} height="100%" justifyContent="center">
                {children}
            </Stack>
        </Box>
    )
}