import {Controller, UseFormReturn} from "react-hook-form";
import {Exhibit} from "../../model/exhibit";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";
import React, {useEffect, useState} from "react";
import {Exhibition} from "../../model/exhibition";
import {exhibitionService} from "../../services/ExhibitionService";
import {ApiException} from "../../http/types";
import {FormControl, FormHelperText, MenuItem, Select, Skeleton, Typography, useTheme} from "@mui/material";

export const ExhibitionSelect = (props: {
    methods: UseFormReturn<Exhibit>,
    disabled: boolean
}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getExhibitionsAsync()
    }, []);

    const getExhibitionsAsync = async () => {
        setLoading(true);
        try {
            const exhibitions = await exhibitionService.getExhibitions({});
            if (exhibitions.length < 1) {
                snackbar(`You must have at least one active Exhibition to create Exhibit.`, {variant: "error"})
                navigate("/exhibitions");
            }
            setExhibitions(exhibitions);
        } catch (err) {
            if (err instanceof ApiException) snackbar(`Fetching exhibitions failed. Status: ${err.statusCode}, message: ${err.message}`, {variant: "error"})
            else snackbar(`Fetching exhibitions failed.`, {variant: "error"})
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormControl size={"small"} fullWidth>
            <Typography variant='body1' pb={1}>Collection *</Typography>
            {loading ? <Skeleton variant="rectangular" width={"100%"} height={40} sx={{display: 'flex'}}/> :
                <Controller
                    rules={{
                        required: {
                            value: true,
                            message: t("validation.required")
                        }
                    }}
                    render={({
                                 field: {onChange, value},
                                 fieldState: {invalid, error},
                             }) => (
                        <>
                            <Select
                                required
                                disabled={props.disabled}
                                defaultValue={exhibitions[0] ? exhibitions[0].id : undefined}
                                onChange={onChange}
                                value={value}
                                error={invalid}
                                sx={{
                                    backgroundColor: theme.palette.secondary.light
                                }}
                            >
                                {exhibitions.map((exhibition, index) => (
                                    <MenuItem key={exhibition.id + index} value={exhibition.id}>{exhibition.referenceName}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText error>{error ? error.message : null}</FormHelperText>
                        </>
                    )}
                    control={props.methods.control}
                    name="exhibitionId"
                />
            }
        </FormControl>
    )
}