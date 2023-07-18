import {Stack, TextField, TextFieldProps, Typography} from "@mui/material";
import React from "react";
import {Control, Controller, ControllerProps, FieldError} from "react-hook-form";
import {useTranslation} from "react-i18next";

interface TextInputCustomProps {
    name: string;
    title?: string,
    subtitle?: string,
    control?: Control<any>;
    customValidation?: ControllerProps['rules'];
    maxLength?: number;
    pattern?: RegExp

}

const TextInput = ({
                       name,
                       title,
                       subtitle,
                       control,
                       customValidation = {},
                       maxLength = undefined,
                       pattern = undefined,
                       required = undefined,
                       multiline,
                       rows,
                       ...rest
                   }: TextInputCustomProps & TextFieldProps) => {
    const {t} = useTranslation();

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
                <Stack>
                    {title && <Typography variant='body2' fontWeight='bolder'>{`${title} ${required ? "*" : ""}`}</Typography>}
                    {title && <Typography variant='subtitle2'>{subtitle}</Typography>}
                    <TextField
                        {...rest}
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                        onBlur={onBlur}
                        required={required}
                        error={invalid}
                        helperText={error ? error.message : null}
                        size='small'
                        fullWidth
                        multiline={multiline}
                        rows={rows}
                        sx={{
                            paddingTop: 1.5
                        }}
                    />
                </Stack>
            )}
        />
    )
}

export default TextInput