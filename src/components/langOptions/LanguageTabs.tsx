import {UseFieldArrayReturn} from "react-hook-form";
import {useTranslation} from "react-i18next";
import React, {useCallback, useEffect, useState} from "react";
import TabContext from "@mui/lab/TabContext";
import {LanguageOptionsHolder, LanguageSelectDialog} from "../form/LanguageSelect";
import {Box, Button, Stack, Tab} from "@mui/material";
import TabList from "@mui/lab/TabList";
import {TabTitle} from "./TabTitle";
import AddIcon from "@mui/icons-material/Add";
import {NoLanguagePlaceholder} from "./NoLanguagePlaceholder";

interface LanguageTabsProps {
    arrayMethods: UseFieldArrayReturn<LanguageOptionsHolder, "langOptions", "id">;
    FormComponent: React.ComponentType<{ key: string; index: number }>;
}

export function LanguageTabs({arrayMethods, FormComponent}: LanguageTabsProps) {
    const {t} = useTranslation();
    const [tab, setTab] = useState("0");
    const [selectLangDialogOpen, setSelectLangDialogOpen] = useState(false);

    useEffect(() => {
        if (arrayMethods.fields.length === 0) setTab('0')
        else setTab(`${arrayMethods.fields.length - 1}`)
    }, [arrayMethods.fields]);

    const handleClose = () => {
        setSelectLangDialogOpen(false);
    };

    const handleRemoveLang = useCallback((index: number) => {
        arrayMethods.remove(index);
        setTab('0')
    }, [arrayMethods]);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    const handleClickOpen = () => {
        setSelectLangDialogOpen(true);
    };

    return (
        <TabContext value={tab}>
            <LanguageSelectDialog open={selectLangDialogOpen} arrayMethods={arrayMethods} handleClose={handleClose}/>
            <Stack sx={{borderBottom: 1, borderColor: 'divider'}} direction="row" alignItems="center" spacing={1}>
                <TabList variant="scrollable" scrollButtons={false} onChange={handleChange}>
                    {arrayMethods.fields.map((field, index) => (
                        <Tab key={field.id}
                             value={`${index}`}
                             sx={{paddingRight: 0}}
                             icon={
                                 <TabTitle
                                     handleRemoveLang={handleRemoveLang}
                                     index={index}
                                     countryCode={field.lang}
                                 />
                             }
                        />
                    ))}
                </TabList>
                <Box px={0}>
                    <Button variant="text" onClick={handleClickOpen} startIcon={<AddIcon color="primary" fontSize='medium'/>}>{t("common.add")}</Button>
                </Box>
            </Stack>
            {arrayMethods.fields.length === 0 ? <NoLanguagePlaceholder/> : null}
            {arrayMethods.fields.map((field, index) => (
                <FormComponent key={field.id} index={index}/>
            ))}
        </TabContext>
    );
}