import {Stack, styled, TextField, TextFieldProps, Tooltip, tooltipClasses, TooltipProps, Typography, useTheme} from "@mui/material";
import React from "react";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import {grey} from "@mui/material/colors";

export const CustomTooltip = styled(({className, ...props}: TooltipProps) => (
    <Tooltip {...props} arrow classes={{popper: className}}/>
))(({theme}) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.primary.light,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
        fontSize: theme.typography.fontSize,
        border: '1px solid #dadde9',
        maxWidth: 220,
    },
}));

const TextInputWithHint = (props: { title?: string, subtitle?: string } & TextFieldProps) => {
    const theme = useTheme()

    return (
        <Stack>
            <Stack spacing={1} direction="row" alignItems="center">
                {props.title && <Typography variant='body1' fontWeight='bolder'>{props.title}</Typography>}
                <CustomTooltip title={props.subtitle} placement="right">
                    <HelpOutlineRoundedIcon sx={{fontSize: '18px', color: grey[700]}}/>
                </CustomTooltip>
            </Stack>
            <TextField
                sx={{
                    paddingTop: 1.5
                }}
                size='small'
                fullWidth
                required={props.required}
                multiline={props.multiline}
                rows={props.rows}
            />
        </Stack>
    )
}

export default TextInputWithHint