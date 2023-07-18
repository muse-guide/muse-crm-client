import {Stack, TextField, TextFieldProps, Typography, useTheme} from "@mui/material";
import React from "react";
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import {CustomTooltip} from "./CustomTooltip";
import {grey} from "@mui/material/colors";

const TextInputWithHint = (props: { title?: string, subtitle?: string } & TextFieldProps) => {
    const theme = useTheme()

    return (
        <Stack>
            <Stack spacing={1} direction="row" alignItems="center">
                {props.title && <Typography variant='body2' fontWeight='bolder'>{props.title}</Typography>}
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