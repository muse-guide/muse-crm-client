import React from "react";
import {Grid2, Grid2Props, Paper, Skeleton, Stack, Typography} from "@mui/material";
import {PaperProps} from "@mui/material/Paper";

type PanelProps = {
    children: React.ReactNode
    panelAction?: React.ReactNode
    loading: boolean
    title: string,
    subtitle?: string
    skeletonHeight?: number,
}

export const BasePanel = ({children, ...props}: PaperProps) => {
    return (
        <Paper variant={"outlined"} sx={{width: '100%'}} {...props}>
            {children}
        </Paper>
    )
}

export const Panel = ({children, loading, title, subtitle, skeletonHeight = 400, panelAction, ...rest}: PanelProps) => {
    return (
        <>
            {loading
                ? <Skeleton variant="rectangular" height={skeletonHeight}/>
                : <BasePanel {...rest}>
                    <Grid2 container spacing={3} p={3}>
                        <Grid2 size={12}>
                            <Stack flexWrap={"wrap"} direction={"row"} alignItems={"start"} gap={2} justifyContent={"space-between"}>
                                <Stack spacing={0.25} display={"flex"} flexGrow={1}>
                                    <Typography variant='h6' fontWeight='bolder'>{title}</Typography>
                                    {subtitle && <Typography variant='body1'>{subtitle}</Typography>}
                                </Stack>
                                <Stack>
                                    {panelAction}
                                </Stack>
                            </Stack>
                        </Grid2>
                        {children}
                    </Grid2>
                </BasePanel>
            }
        </>
    )
}

export const FullRow = ({children, ...props}: Grid2Props) => {
    return (
        <Grid2 size={12} {...props}>{children}</Grid2>
    )
}

export const HalfRow = ({children, ...props}: Grid2Props) => {
    return (
        <Grid2 size={{xs: 12, md: 6}} {...props}>{children}</Grid2>
    )
}