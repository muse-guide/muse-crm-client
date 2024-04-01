import {UseFieldArrayReturn, useFormContext} from "react-hook-form";
import {Exhibit} from "../../model/exhibit";
import React, {useCallback, useEffect, useState} from "react";
import {Box, Button, Divider, Stack, Tab, Typography, useTheme} from "@mui/material";
import {LanguageOptionsHolder, LanguageSelectDialog} from "../../components/form/LanguageSelect";
import AddIcon from "@mui/icons-material/Add";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import {useTabContext} from "@mui/lab";
import Grid from "@mui/material/Unstable_Grid2";
import TextInput from "../../components/form/TextInput";
import {NoLanguagePlaceholder} from "../../components/langOptions/NoLanguagePlaceholder";
import {TabTitle} from "../../components/langOptions/TabTitle";
import {EmptyPlaceholder} from "../../components/page";
import {useTranslation} from "react-i18next";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {AudioGeneratorDialog} from "./AudioGeneratorDialog";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import {ArticleDialog} from "./ArticleDialog";

export function LanguageTabs(props: { arrayMethods: UseFieldArrayReturn<Exhibit, "langOptions", "id"> }) {
    const [value, setValue] = useState("0");
    const [selectLangDialogOpen, setSelectLangDialogOpen] = useState(false);

    useEffect(() => {
        if (props.arrayMethods.fields.length === 0) setValue('0')
        else setValue(`${props.arrayMethods.fields.length - 1}`)
    }, [props.arrayMethods.fields]);
    const handleClickOpen = () => {
        setSelectLangDialogOpen(true);
    };

    const handleClose = () => {
        setSelectLangDialogOpen(false);
    };

    const handleRemoveLang = (index: number) => {
        props.arrayMethods.remove(index);
        setValue('0')
    };

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <TabContext value={value}>
            <Box sx={{width: '100%'}}>
                <LanguageSelectDialog open={selectLangDialogOpen} arrayMethods={props.arrayMethods as unknown as UseFieldArrayReturn<LanguageOptionsHolder, "langOptions">} handleClose={handleClose}/>
                <Stack sx={{borderBottom: 1, borderColor: 'divider'}} direction="row" alignItems="center" spacing={1}>
                    <TabList variant="scrollable" scrollButtons={false} onChange={handleChange}>
                        {props.arrayMethods.fields.map((field, index) => (
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
                        <Button variant="text" onClick={handleClickOpen} startIcon={<AddIcon color="primary" fontSize='medium'/>}>Dodaj</Button>
                    </Box>
                </Stack>
                {props.arrayMethods.fields.length === 0 ? <NoLanguagePlaceholder/> : null}
                {props.arrayMethods.fields.map((field, index) => (
                    <ExhibitLanguageSpecificForm key={field.id} index={index}/>
                ))}
            </Box>
        </TabContext>
    );
}

interface ExhibitLanguageSpecificFormProps {
    index: number;
}

export const ExhibitLanguageSpecificForm = (props: ExhibitLanguageSpecificFormProps) => {
    const methods = useFormContext()
    const [audioDialogOpen, setAudioDialogOpen] = useState(false);
    const [articleDialogOpen, setArticleDialogOpen] = useState(false);
    const theme = useTheme()
    const {t} = useTranslation();
    const {value} = useTabContext() || {};


    const handleAudioDialogOpen = () => setAudioDialogOpen(true)
    const handleAudioDialogClose = useCallback(() => setAudioDialogOpen(false), [])
    const handleSaveAudio = useCallback((markup: string | undefined, voice: string | undefined) => {
        if (markup === undefined || voice === undefined) {
            methods.setValue(`langOptions.${props.index}.audio`, undefined)
        } else {
            methods.setValue(`langOptions.${props.index}.audio.markup`, markup)
            methods.setValue(`langOptions.${props.index}.audio.voice`, voice)
        }
        setAudioDialogOpen(false);
    }, [])

    const handleArticleDialogOpen = () => setArticleDialogOpen(true)
    const handleArticleDialogClose = () => setArticleDialogOpen(false)
    const handleSaveArticle = (markup: string | undefined) => {
        if (markup === undefined) {
            methods.setValue(`langOptions.${props.index}.description`, undefined)
        } else {
            methods.setValue(`langOptions.${props.index}.description`, markup)
        }
        setArticleDialogOpen(false);
    };

    const audioInput = {
        lang: methods.getValues(`langOptions.${props.index}.lang`),
        key: methods.getValues(`langOptions.${props.index}.audio.key`),
        markup: methods.getValues(`langOptions.${props.index}.audio.markup`),
        voice: methods.getValues(`langOptions.${props.index}.audio.voice`),
    }


    methods.getValues()

    return (
        <Box sx={{display: props.index.toString() === value ? 'block' : 'none'}}>
            <AudioGeneratorDialog
                open={audioDialogOpen}
                handleClose={handleAudioDialogClose}
                handleSave={handleSaveAudio}
                input={audioInput}
            />
            <ArticleDialog
                open={articleDialogOpen}
                markup={methods.getValues(`langOptions.${props.index}.description`)}
                handleClose={handleArticleDialogClose}
                handleSave={handleSaveArticle}
            />
            <Grid container spacing={3} pt={4}>
                <Grid xs={12}>
                    <TextInput
                        name={`langOptions.${props.index}.title`}
                        control={methods.control}
                        title="Tytuł wystawy"
                        placeholder="Moja wielka wystawa"
                        required
                    />
                </Grid>
                <Grid xs={12}>
                    <TextInput
                        name={`langOptions.${props.index}.subtitle`}
                        control={methods.control}
                        title="Podtytuł wystawy"
                        placeholder="Moja wielka wystawa to jest to!"
                        multiline={true}
                        rows={2}
                        required
                    />
                </Grid>
                <Grid xs={12} pt={2}>
                    <Stack gap={3}>
                        <Divider/>
                        {methods.getValues(`langOptions.${props.index}.audio`) ?
                            <Stack direction={"row"} gap={2} alignItems={"center"}>
                                <Button variant="contained" onClick={handleAudioDialogOpen} startIcon={<PlayCircleIcon/>} disableElevation>{t("common.audio")}</Button>
                                <Typography variant='body1'>Posłuchaj wygenerownego audio albo edytuj tekst to przeczytania.</Typography>
                            </Stack>
                            :
                            <EmptyPlaceholder>
                                <Typography variant='body1' fontWeight='bolder'>Brak audio przewodnika</Typography>
                                <Typography sx={{color: theme.palette.text.secondary, paddingBottom: 2}} variant='subtitle2'>Użyj najlepszych rozwiązan AI aby wygenerować audio przewodnik.</Typography>
                                <Button startIcon={<PlayArrowIcon/>} variant="outlined" onClick={handleAudioDialogOpen}>Generate audio</Button>
                            </EmptyPlaceholder>
                        }
                    </Stack>
                </Grid>
                <Grid xs={12} pt={2} pb={3}>
                    <Stack gap={3}>
                        <Divider/>
                        {methods.getValues(`langOptions.${props.index}.description`) ?
                            <Stack direction={"row"} gap={2} alignItems={"center"}>
                                <Button variant="contained" onClick={handleArticleDialogOpen} startIcon={<DescriptionIcon/>} disableElevation>{t("common.article")}</Button>
                                <Typography variant='body1'>Zobacz albo edytuj tekst artykułu.</Typography>
                            </Stack>
                            :
                            <EmptyPlaceholder>
                                <Typography variant='body1' fontWeight='bolder'>Description missing</Typography>
                                <Typography sx={{color: theme.palette.text.secondary, paddingBottom: 2}} variant='subtitle2'>
                                    You can enrich your resource with optional description in form of article.
                                </Typography>
                                <Button startIcon={<DescriptionIcon/>} variant="outlined" onClick={handleArticleDialogOpen}>Create article</Button>
                            </EmptyPlaceholder>
                        }
                    </Stack>
                </Grid>
                {/*<Grid xs={12} pt={3}>*/}
                {/*    <TextEditor*/}
                {/*        name={`langOptions.${props.index}.description`}*/}
                {/*        control={methods.control}*/}
                {/*        title="Opcjonalny opis wystawy. W opis możesz wbudować zdjęcia. Dowiedz się więcej"*/}
                {/*    />*/}
                {/*</Grid>*/}
            </Grid>
        </Box>
    )
}

export const PlayAudioButton = () => {
    const {t} = useTranslation();

    return (
        <>
            <Button variant="contained" startIcon={<PlayArrowIcon/>} disableElevation>{t("common.listen")}</Button>
        </>
    )
}