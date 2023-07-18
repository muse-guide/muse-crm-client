import {Stack, SxProps, Theme, Typography} from "@mui/material";

interface PageTitleProps {
    title: string,
    subtitle?: string,
    sx? : SxProps<Theme>
}

export const PageTitle = (props: PageTitleProps) => {
    return (
        <Stack sx={props.sx} spacing={4}>
            <Typography variant='h4' fontWeight='bolder'>{props.title}</Typography>
            {props.subtitle && <Typography variant={'body1'}>{props.subtitle}</Typography>}
        </Stack>
    )
}