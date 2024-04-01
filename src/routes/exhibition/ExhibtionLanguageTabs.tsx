import {UseFieldArrayReturn, useFormContext} from "react-hook-form";
import {Exhibition} from "../../model/exhibition";
import React, {useEffect, useState} from "react";
import {Box, Button, Stack, Tab} from "@mui/material";
import {LanguageOptionsHolder, LanguageSelectDialog} from "../../components/form/LanguageSelect";
import AddIcon from "@mui/icons-material/Add";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import {useTabContext} from "@mui/lab";
import Grid from "@mui/material/Unstable_Grid2";
import TextInput from "../../components/form/TextInput";
import TextEditor from "../../components/textEditor/TextEditor";
import {NoLanguagePlaceholder} from "../../components/langOptions/NoLanguagePlaceholder";
import {TabTitle} from "../../components/langOptions/TabTitle";

export function LanguageTabs(props: { arrayMethods: UseFieldArrayReturn<Exhibition, "langOptions", "id"> }) {
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
                    <ExhibitionLanguageSpecificForm key={field.id} index={index}/>
                ))}
            </Box>
        </TabContext>
    );
}

interface ExhibitionLanguageSpecificFormProps {
    index: number;
}

export const ExhibitionLanguageSpecificForm = (props: ExhibitionLanguageSpecificFormProps) => {
    const methods = useFormContext()
    const {value} = useTabContext() || {};
    return (
        <Box sx={{display: props.index.toString() === value ? 'block' : 'none'}}>
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
                <Grid xs={12}>
                    <TextEditor
                        name={`langOptions.${props.index}.description`}
                        control={methods.control}
                        title="Opcjonalny opis wystawy. W opis możesz wbudować zdjęcia. Dowiedz się więcej"
                    />
                </Grid>
            </Grid>
        </Box>
    )
}
