import {styled, Tooltip, tooltipClasses, TooltipProps} from "@mui/material";
import React from "react";

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