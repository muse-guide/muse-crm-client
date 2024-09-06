import React from "react";
import {FormControl, MenuItem, Stack, TextField, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

export const InvoicePeriodSelect = (props: {
    label: string,
    values: string[],
    value?: string,
    onChange: (id: string) => void,
}) => {
    const {t} = useTranslation();

    return (
        <FormControl size={"small"} fullWidth>
            <Stack direction="row" alignItems={"baseline"} gap={1.5}>
                <Typography variant='body1' pb={1}>{props.label}:</Typography>
                <TextField
                    name={"exhibitionSelect"}
                    size="small"
                    value={props.value}
                    onChange={event => {
                        props.onChange(event.target.value)
                    }}
                    select
                    required
                    sx={{
                        minWidth: 140
                    }}
                >
                    {props.values.map((invoicePeriod, index) => (
                        <MenuItem key={invoicePeriod + index} value={invoicePeriod}>{invoicePeriod}</MenuItem>
                    ))}

                </TextField>
            </Stack>
        </FormControl>
    )
}