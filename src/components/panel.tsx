import React from "react";
import {Grid2Props, Paper, Skeleton, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {PaperProps} from "@mui/material/Paper";
import {borderColor} from "../index";

type PanelProps = {
    children: React.ReactNode
    loading: boolean
    title: string,
    subtitle?: string
    skeletonHeight?: number,
}

export const BasePanel = ({children, ...props}: PaperProps) => {
    return (
        <Paper variant={"outlined"} sx={{width: '100%', borderColor: borderColor}} {...props}>
            {children}
        </Paper>
    )
}

export const Panel = ({children, loading, title, subtitle, skeletonHeight = 400}: PanelProps) => {
    return (
        <>
            {loading ? <Skeleton variant="rectangular" height={skeletonHeight}/>
                :
                <BasePanel>
                    <Grid container spacing={3} p={3}>
                        <Grid xs={12}>
                            <Stack spacing={1}>
                                <Typography variant='body1' fontWeight='bolder'>{title}</Typography>
                                {subtitle && <Typography variant='body1'>{subtitle}</Typography>}
                            </Stack>
                        </Grid>
                        {children}
                    </Grid>
                </BasePanel>
            }
        </>
    )
}

export const FullRow = ({children, ...props}: Grid2Props) => {
    return (
        <Grid xs={12} {...props}>{children}</Grid>
    )
}

export const HalfRow = ({children, ...props}: Grid2Props) => {
    return (
        <Grid xs={6} {...props}>{children}</Grid>
    )
}