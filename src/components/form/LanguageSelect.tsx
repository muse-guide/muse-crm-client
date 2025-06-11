import React, {useState} from "react";
import {FormControl, FormHelperText, MenuItem, Select, SelectChangeEvent, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {UseFieldArrayReturn} from "react-hook-form";
import TranslateIcon from '@mui/icons-material/Translate';
import LanguageFlag from "../LaungageFlag";

export interface LanguageOptionsHolder {
    langOptions: {
        lang: string;
        title: string;
        subtitle: string;
    }[]
}

interface LanguageSelectDialogProps {
    open: boolean,
    handleClose: () => void
    arrayMethods: UseFieldArrayReturn<LanguageOptionsHolder, "langOptions", "id">;
}

export const LanguageSelectDialog = (props: LanguageSelectDialogProps) => {
    const {t} = useTranslation();
    const [lang, setLang] = useState('pl-PL');
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
                    <Stack pb={1} direction={"row"} alignItems={"center"} gap={1}>
                        <TranslateIcon/>
                        {t("dialog.languageSelect.title")}
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{
                    minWidth: '400px',
                    maxWidth: '460px',
                    paddingBottom: 4
                }}
                >
                    <DialogContentText>
                        {t("dialog.languageSelect.description")}
                    </DialogContentText>
                    <FormControl sx={{paddingTop: 1.5, paddingBottom: 0, width: "100%"}}>
                        <Select
                            error={validationError}
                            value={lang}
                            onChange={handleChange}
                            size={"small"}
                            sx={{width: "100%"}}
                        >
                            <MenuItem value={'pl-PL'}><LanguageOption countryCode='pl'/></MenuItem>
                            <MenuItem value={'en-GB'}><LanguageOption countryCode='gb'/></MenuItem>
                            <MenuItem value={'es-ES'}><LanguageOption countryCode='es'/></MenuItem>
                        </Select>
                        <FormHelperText error={validationError}>{validationError ? t("error.languageOptionExists") : null}</FormHelperText>
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
            <LanguageFlag countryCode={countryCode} size={18}/>
            <Typography variant='body1' fontSize='bold' pl={1}>
                {t(`dialog.languageSelect.langOption.${countryCode}`)}
            </Typography>
        </Stack>
    )
}