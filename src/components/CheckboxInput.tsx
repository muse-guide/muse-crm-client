import {Checkbox, FormControlLabel, Typography} from "@mui/material";
import React from "react";
import {Control, Controller} from "react-hook-form";

export const CheckboxInput = (props: { name: string, label: string, defaultChecked: boolean, control?: Control<any> }) => {
    return (
        <FormControlLabel
            control={
                <Controller
                    name={props.name}
                    control={props.control}
                    defaultValue={props.defaultChecked}
                    render={({field}) => (
                        <Checkbox
                            sx={{mr: 1, ml: 2}}
                            name={props.name}
                            checked={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
            }
            label={<Typography variant="body2">
                {props.label}
            </Typography>}
        />
    )
}