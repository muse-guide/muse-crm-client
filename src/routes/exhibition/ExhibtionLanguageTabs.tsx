import {useFormContext} from "react-hook-form";
import React, {useCallback} from "react";
import {Box, Divider, Grid2, Stack} from "@mui/material";
import {useTabContext} from "@mui/lab";
import TextInput from "../../components/form/TextInput";
import {AudioGeneratorDialog} from "../../components/audioEditor/AudioGeneratorDialog";
import {ArticleDialog} from "../../components/articleEditor/ArticleDialog";
import useDialog from "../../components/hooks";
import {useTranslation} from "react-i18next";
import {AudioButton, NoAudioPlaceholder} from "../../components/langOptions/AudioButton";
import {ArticleButton, NoArticlePlaceholder} from "../../components/langOptions/ArticleButton";

interface ExhibitionLanguageSpecificFormProps {
    index: number;
}

export const ExhibitionLanguageSpecificForm = (props: ExhibitionLanguageSpecificFormProps) => {
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
                        title={t("page.exhibition.languagesForm.exhibitionTitle")}
                        placeholder={t("page.exhibition.languagesForm.exhibitionTitlePlaceholder")}
                        required
                        maxLength={120}
                    />
                </Grid2>
                <Grid2 size={12}>
                    <TextInput
                        name={`langOptions.${props.index}.subtitle`}
                        control={methods.control}
                        title={t("page.exhibition.languagesForm.exhibitionSubtitle")}
                        placeholder={t("page.exhibition.languagesForm.exhibitionSubtitlePlaceholder")}
                        multiline={true}
                        rows={2}
                        required
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
