import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";
import React, {useCallback, useEffect, useState} from "react";
import {Exhibition} from "../../model/exhibition";
import {exhibitionService} from "../../services/ExhibitionService";
import {ApiException} from "../../http/types";
import {FormControl, MenuItem, Skeleton, TextField, Typography} from "@mui/material";

export const ExhibitionSelect = (props: {
    value?: string,
    onChange: (id: string) => void,
    disabled: boolean
}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getExhibitionsAsync = useCallback(async () => {
        setLoading(true);
        try {
            const exhibitions = await exhibitionService.getExhibitions({});
            if (exhibitions.length < 1) {
                snackbar(`You must have at least one active Exhibition to manage Exhibits.`, {variant: "error"})
                navigate("/exhibitions");
                return
            }
            setExhibitions(exhibitions);

            if (!props.value) {
                props.onChange(exhibitions[0].id)
            }
        } catch (err) {
            if (err instanceof ApiException) snackbar(`Fetching exhibitions failed. Status: ${err.statusCode}, message: ${err.message}`, {variant: "error"})
            else snackbar(`Fetching exhibitions failed.`, {variant: "error"})
        } finally {
            setLoading(false);
        }
    }, [props.value, navigate, snackbar]);

    useEffect(() => {
        getExhibitionsAsync()
    }, [getExhibitionsAsync]);

    return (
        <FormControl size={"small"} fullWidth>
            <Typography variant='body1' pb={1}>Collection *</Typography>
            {(loading || exhibitions.length < 1) ? <Skeleton variant="rectangular" width={"100%"} height={40} sx={{display: 'flex'}}/> :
                <TextField
                    name={"exhibitionSelect"}
                    size="small"
                    value={props.value}
                    onChange={event => {
                        props.onChange(event.target.value)
                    }}
                    select
                    required
                    disabled={props.disabled}
                >
                    {exhibitions.map((exhibition, index) => (
                        <MenuItem key={exhibition.id + index} value={exhibition.id}>{exhibition.referenceName}</MenuItem>
                    ))}
                </TextField>

            }
        </FormControl>
    )
}