import React, {useState} from "react";
import {FormControl, FormHelperText, MenuItem, Select, SelectChangeEvent, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {CircleFlag} from "react-circle-flags";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {UseFieldArrayReturn} from "react-hook-form";
import {Exhibition} from "../../model/exhibition";

interface LanguageSelectDialogProps {
    open: boolean,
    handleClose: () => void
    arrayMethods: UseFieldArrayReturn<Exhibition, "langOptions", "id">;
}

export const LanguageSelectDialog = (props: LanguageSelectDialogProps) => {
    const {t} = useTranslation();
    const [lang, setLang] = useState('pl');
    const [validationError, setValidationError] = useState(false);

    const handleChange = (event: SelectChangeEvent) => {
        setValidationError(false)
        setLang(event.target.value);
    }

    const handleAdd = () => {
        const alreadyAdded = props.arrayMethods.fields.some(item => item.lang === lang)
        if (alreadyAdded) {
            setValidationError(true)
        } else {
            props.arrayMethods.append({
                lang: lang,
                title: "",
                subtitle: ""
            });
            handleClose()
        }
    };

    const handleClose = () => {
        setValidationError(false)
        props.handleClose()
    }

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
            >
                <DialogTitle fontSize="large" fontWeight="bold" sx={{pt: 3}}>
                    {t("Wybierz język")}
                </DialogTitle>
                <DialogContent sx={{
                    minWidth: '400px',
                    maxWidth: '460px',
                    paddingBottom: 4
                }}
                >
                    <DialogContentText>
                        Nowy język pojawi się we wszystkich eksponatach należących do kolekcji.
                    </DialogContentText>
                    <FormControl sx={{paddingTop: 1.5, paddingBottom: 0, width: "100%"}}>
                        <Select
                            error={validationError}
                            value={lang}
                            onChange={handleChange}
                            size={"small"}
                            sx={{width: "100%"}}
                        >
                            <MenuItem value={'pl'}><LanguageOption countryCode='pl'/></MenuItem>
                            <MenuItem value={'gb'}><LanguageOption countryCode='gb'/></MenuItem>
                            <MenuItem value={'es'}><LanguageOption countryCode='es'/></MenuItem>
                        </Select>
                        <FormHelperText error={validationError}>{validationError ? "Język już w kolekcji" : null}</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{px: '24px', pb: '20px'}}>
                    <Button variant="text" onClick={handleClose} autoFocus>{t("common.cancel")}</Button>
                    <Button variant="contained" disableElevation onClick={handleAdd} autoFocus>{t("common.add")}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const LanguageOption = ({countryCode}: { countryCode: string }) => {
    const {t} = useTranslation();

    return (
        <Stack direction='row' alignItems='center'>
            <CircleFlag countryCode={countryCode} height="18"/>
            <Typography variant='body1' fontSize='bold' pl={1}>
                {t(`langSelect.${countryCode}`)}
            </Typography>
        </Stack>
    )
}