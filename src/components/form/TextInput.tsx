import {Box, Stack, TextField, TextFieldProps, Typography, useTheme} from "@mui/material";
import React from "react";
import {Control, Controller, ControllerProps, FieldError} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {grey} from "@mui/material/colors";

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
}

const TextInput = ({
                       name,
                       title,
                       subtitle,
                       helperText,
                       control,
                       customValidation = {},
                       maxLength = undefined,
                       pattern = undefined,
                       required = undefined,
                       multiline,
                       rows,
                       fullWidth = true,
                       ...rest
                   }: TextInputCustomProps & TextFieldProps) => {
    const {t} = useTranslation();
    const theme = useTheme()

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
                            onChange={onChange}
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
                                backgroundColor: theme.palette.secondary.light
                            }}
                        />
                    </Box>
                </Stack>
            )}
        />
    )
}

export default TextInput