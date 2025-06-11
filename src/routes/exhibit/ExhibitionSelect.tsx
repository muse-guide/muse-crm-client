import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";
import React, {useCallback, useEffect, useState} from "react";
import {Exhibition} from "../../model/exhibition";
import {exhibitionService} from "../../services/ExhibitionService";
import {FormControl, MenuItem, Skeleton, TextField, Typography} from "@mui/material";
import {useHandleError} from "../../http/errorHandler";

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
    const handleError = useHandleError();

    const getExhibitionsAsync = useCallback(async () => {
        setLoading(true);
        try {
            const exhibitions = await exhibitionService.getAllExhibitions();
            if (exhibitions.length < 1) {
                snackbar(t("error.noActiveExhibition"), {variant: "error"})
                navigate("/exhibitions/new");
                return
            }
            setExhibitions(exhibitions);

            if (!props.value) {
                props.onChange(exhibitions[0].id)
            }
        } catch (error) {
            handleError("error.fetchingExhibitionsFailed", error);
        } finally {
            setLoading(false);
        }
    }, [props.value, navigate, snackbar]);

    useEffect(() => {
        getExhibitionsAsync()
    }, [getExhibitionsAsync]);

    return (
        <FormControl size={"small"} fullWidth>
            <Typography variant='body1' pb={1}>{t('page.exhibits.table.collection')} *</Typography>
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