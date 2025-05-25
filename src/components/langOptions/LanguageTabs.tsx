import {UseFieldArrayReturn, useFormContext} from "react-hook-form";
import {useTranslation} from "react-i18next";
import React, {useCallback, useEffect, useState} from "react";
import TabContext from "@mui/lab/TabContext";
import {LanguageOptionsHolder, LanguageSelectDialog} from "../form/LanguageSelect";
import {Box, Button, Divider, Grid2, Stack, Tab} from "@mui/material";
import TabList from "@mui/lab/TabList";
import {TabTitle} from "./TabTitle";
import AddIcon from "@mui/icons-material/Add";
import {NoLanguagePlaceholder} from "./NoLanguagePlaceholder";
import useDialog from "../hooks";
import {useTabContext} from "@mui/lab";
import {AudioGeneratorDialog} from "../audioEditor/AudioGeneratorDialog";
import {ArticleDialog} from "../articleEditor/ArticleDialog";
import TextInput from "../form/TextInput";
import {AudioButton, NoAudioPlaceholder} from "./AudioButton";
import {ArticleButton, NoArticlePlaceholder} from "./ArticleButton";

interface LanguageTabsProps {
    arrayMethods: UseFieldArrayReturn<LanguageOptionsHolder, "langOptions", "id">;
}

export function LanguageTabs({arrayMethods}: LanguageTabsProps) {
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
            <Stack sx={{borderBottom: arrayMethods.fields.length > 0 ? 1 : 0, borderColor: 'divider'}} direction="row" alignItems="center" spacing={1}>
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
                <LanguageOptionForm key={field.id} index={index}/>
            ))}
        </TabContext>
    );
}


interface LanguageOptionFormProps {
    index: number;
}

export const LanguageOptionForm = (props: LanguageOptionFormProps) => {
    const methods = useFormContext()
    const audioDialog = useDialog()
    const articleDialog = useDialog()
    const {t} = useTranslation();
    const {value} = useTabContext() || {};

    const handleSaveAudio = useCallback((markup: string | undefined, voice: string | undefined) => {
        if (markup === undefined || voice === undefined) {
            methods.setValue(`langOptions.${props.index}.audio`, undefined)
        } else {
            methods.setValue(`langOptions.${props.index}.audio.markup`, markup)
            methods.setValue(`langOptions.${props.index}.audio.voice`, voice)
        }
        audioDialog.closeDialog();
    }, [])

    const handleSaveArticle = (article?: string) => {
        if (article === undefined) {
            methods.setValue(`langOptions.${props.index}.article`, undefined)
        } else {
            methods.setValue(`langOptions.${props.index}.article`, article)
        }
        articleDialog.closeDialog();
    };

    const audioInput = {
        lang: methods.getValues(`langOptions.${props.index}.lang`),
        key: methods.getValues(`langOptions.${props.index}.audio.key`),
        markup: methods.getValues(`langOptions.${props.index}.audio.markup`),
        voice: methods.getValues(`langOptions.${props.index}.audio.voice`),
    }

    return (
        <Box sx={{display: props.index.toString() === value ? 'block' : 'none'}}>
            <AudioGeneratorDialog
                open={audioDialog.isOpen}
                handleClose={audioDialog.closeDialog}
                handleSave={handleSaveAudio}
                input={audioInput}
            />
            <ArticleDialog
                open={articleDialog.isOpen}
                article={methods.getValues(`langOptions.${props.index}.article`)}
                handleClose={articleDialog.closeDialog}
                handleSave={handleSaveArticle}
            />
            <Grid2 container spacing={3} pt={4}>
                <Grid2 size={12}>
                    <TextInput
                        name={`langOptions.${props.index}.title`}
                        control={methods.control}
                        title={t("page.languagesForm.options.title")}
                        placeholder={t("page.languagesForm.options.titlePlaceholder")}
                        required
                        maxLength={120}
                    />
                </Grid2>
                <Grid2 size={12}>
                    <TextInput
                        name={`langOptions.${props.index}.subtitle`}
                        control={methods.control}
                        title={t("page.languagesForm.options.subtitle")}
                        placeholder={t("page.languagesForm.options.subtitlePlaceholder")}
                        multiline={true}
                        rows={2}
                        maxLength={200}
                    />
                </Grid2>
                <Grid2 size={12} pt={2}>
                    <Stack gap={3}>
                        <Divider/>
                        {methods.getValues(`langOptions.${props.index}.audio`)
                            ? <AudioButton onClick={audioDialog.openDialog}/>
                            : <NoAudioPlaceholder onClick={audioDialog.openDialog}/>
                        }
                    </Stack>
                </Grid2>
                <Grid2 size={12} pt={2} pb={3}>
                    <Stack gap={3}>
                        <Divider/>
                        {methods.getValues(`langOptions.${props.index}.article`)
                            ? <ArticleButton onClick={articleDialog.openDialog}/>
                            : <NoArticlePlaceholder onClick={articleDialog.openDialog}/>
                        }
                    </Stack>
                </Grid2>
            </Grid2>
        </Box>
    )
}