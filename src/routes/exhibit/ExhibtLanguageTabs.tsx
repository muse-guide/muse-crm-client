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
    const {t} = useTranslation();
    const [tab, setTab] = useState("0");
    const [selectLangDialogOpen, setSelectLangDialogOpen] = useState(false);

    const handleClose = () => {
        setSelectLangDialogOpen(false);
    };

    const handleRemoveLang = useCallback((index: number) => {
        props.arrayMethods.remove(index);
        setTab('0')
    }, [props.arrayMethods]);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    useEffect(() => {
        if (props.arrayMethods.fields.length === 0) setTab('0')
        else setTab(`${props.arrayMethods.fields.length - 1}`)
    }, [props.arrayMethods.fields]);

    const handleClickOpen = () => {
        setSelectLangDialogOpen(true);
    };

    return (
        <TabContext value={tab}>
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
                        <Button variant="text" onClick={handleClickOpen} startIcon={<AddIcon color="primary" fontSize='medium'/>}>{t("common.add")}</Button>
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
                        title={t("page.exhibit.languagesForm.exhibitTitle")}
                        placeholder={t("page.exhibit.languagesForm.exhibitTitlePlaceholder")}
                        required
                    />
                </Grid>
                <Grid xs={12}>
                    <TextInput
                        name={`langOptions.${props.index}.subtitle`}
                        control={methods.control}
                        title={t("page.exhibit.languagesForm.exhibitSubtitle")}
                        placeholder={t("page.exhibit.languagesForm.exhibitSubtitlePlaceholder")}
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
                                <Typography variant='body1'>{t("page.exhibit.languagesForm.audioHelperText")}</Typography>
                            </Stack>
                            :
                            <EmptyPlaceholder>
                                <Typography variant='body1' fontWeight='bolder'>{t("page.exhibit.languagesForm.noAudioHelperTextTitle")}</Typography>
                                <Typography sx={{color: theme.palette.text.secondary, paddingBottom: 2}} variant='subtitle2' align={"center"}>{t("page.exhibit.languagesForm.noAudioHelperTextSubtitle")}</Typography>
                                <Button startIcon={<PlayArrowIcon/>} variant="outlined" onClick={handleAudioDialogOpen} sx={{paddingTop: 1}}>{t("page.exhibit.actions.generateAudio")}</Button>
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
                                <Typography variant='body1'>{t("page.exhibit.languagesForm.articleHelperText")}</Typography>
                            </Stack>
                            :
                            <EmptyPlaceholder>
                                <Typography variant='body1' fontWeight='bolder'>{t("page.exhibit.languagesForm.noArticleHelperTextTitle")}</Typography>
                                <Typography sx={{color: theme.palette.text.secondary, paddingBottom: 2}} variant='subtitle2' align={"center"}>
                                    {t("page.exhibit.languagesForm.noArticleHelperTextSubtitle")}
                                </Typography>
                                <Button startIcon={<DescriptionIcon/>} variant="outlined" onClick={handleArticleDialogOpen}>{t("page.exhibit.actions.createArticle")}</Button>
                            </EmptyPlaceholder>
                        }
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    )
}