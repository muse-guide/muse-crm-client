import {Box, Stack, TextField, TextFieldProps, Typography} from "@mui/material";
import React from "react";
import {Control, Controller, ControllerProps} from "react-hook-form";
import {useTranslation} from "react-i18next";

interface TextInputCustomProps {
    name: string;
    title?: string,
    subtitle?: string,
    helperText?: string,
    control?: Control<any>;
    customValidation?: ControllerProps['rules'];
    maxLength?: number;
    pattern?: RegExp,
    fullWith?: boolean,
    numeric?: boolean,
}

const TextInput = ({
                       name,
                       title,
                       subtitle,
                       helperText,
                       control,
                       maxLength = undefined,
                       pattern = undefined,
                       required = undefined,
                       numeric = false,
                       multiline,
                       rows,
                       fullWidth = true,
                       ...rest
                   }: TextInputCustomProps & TextFieldProps) => {
    const {t} = useTranslation();

    const customValidation: ControllerProps['rules'] = {};

    if (required) {
        customValidation.required = {
            value: required,
            message: t("validation.required")
        };
    }
    if (maxLength) {
        customValidation.maxLength = {
            value: maxLength,
            message: t("validation.maxLength", {length: maxLength})
        };
    }
    if (pattern) {
        customValidation.pattern = {
            value: pattern,
            message: t("validation.pattern", {pattern: pattern})
        };
    }

    return (
        <Controller
            name={name}
            control={control}
            rules={customValidation}
            render={({
                         field: {value, onChange, onBlur},
                         fieldState: {invalid, error},
                     }) => (
                <Stack spacing={-0.25}>
                    {title && <Typography variant='body1'>{`${title} ${required ? "*" : ""}`}</Typography>}
                    {title && <Typography variant='subtitle2'>{subtitle}</Typography>}
                    <Box pt={0.25}>
                        <TextField
                            {...rest}
                            name={name}
                            value={value || ''}
                            onChange={(event) => {
                                numeric ? onChange(+event.target.value) : onChange(event.target.value)
                            }}
                            onBlur={onBlur}
                            required={required}
                            error={invalid}
                            helperText={error ? error.message : helperText}
                            size='small'
                            fullWidth={fullWidth}
                            multiline={multiline}
                            variant={"outlined"}
                            rows={rows}
                            sx={{
                                marginTop: 1.5,
                            }}
                        />
                    </Box>
                </Stack>
            )}
        />
    )
}

export default TextInput