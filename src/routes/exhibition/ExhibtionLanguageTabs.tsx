import {FieldError, UseFieldArrayReturn, useFormContext} from "react-hook-form";
import {Exhibition} from "../../model/Exhibition";
import React, {useEffect, useState} from "react";
import {Box, Button, Stack, Tab, Typography, useTheme} from "@mui/material";
import {LanguageSelectDialog} from "../../components/LanguageSelect";
import AddIcon from "@mui/icons-material/Add";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import {CircleFlag} from "react-circle-flags";
import CancelIcon from "@mui/icons-material/Cancel";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import ErrorIcon from '@mui/icons-material/Error';
import {useTabContext} from "@mui/lab";
import Grid from "@mui/material/Unstable_Grid2";
import TextInput from "../../components/TextInput";
import TextEditor from "../../components/TextEditor/TextEditor";

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
                <LanguageSelectDialog open={selectLangDialogOpen} arrayMethods={props.arrayMethods} handleClose={handleClose}/>
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

const NoLanguagePlaceholder = () => {
    const theme = useTheme()
    return (
        <Box width={"100%"}
             sx={{
                 border: 1,
                 borderStyle: "dashed",
                 borderColor: theme.palette.grey[600],
                 backgroundColor: theme.palette.grey[50]
             }}>
            <Stack alignItems="center" spacing={0} py={7}>
                <Typography sx={{color: theme.palette.text.secondary, paddingBottom: 2}} variant='subtitle2'>Dodaj język w jakim będzie dostępna kolekcja</Typography>
            </Stack>
        </Box>
    )
}

const TabTitle = ({index, countryCode, handleRemoveLang}: { index: number, countryCode: string, handleRemoveLang: (index: number) => void }) => {
    const [removeLangDialogOpen, setRemoveLangDialogOpen] = useState(false);
    const [containError, setContainError] = useState(false);
    const {formState: {errors, isSubmitting, isValidating}} = useFormContext()

    useEffect(() => {
        const errorsArray = errors?.langOptions as unknown as FieldError[]
        if (errorsArray?.length > 0 && errorsArray[index]) setContainError(true)
        else setContainError(false)
    }, [errors, index, isSubmitting, isValidating]);

    const handleClickOpen = () => {
        setRemoveLangDialogOpen(true);
    };

    const handleClose = () => {
        setRemoveLangDialogOpen(false);
    };

    const handleAgree = () => {
        handleRemoveLang(index)
        setRemoveLangDialogOpen(false);
    };

    return (
        <>
            <ConfirmationDialog
                title={"Usun język"}
                description={"Czy jesteś pewien, że chcesz nieodwracalnie usunąć język z wystawy? Spowoduje to usunięcie tego języka ze wszystkich eksponatów należących do tej wystawy."}
                open={removeLangDialogOpen}
                handleAgree={handleAgree}
                handleClose={handleClose}
            />
            <Stack direction='row' alignItems='center' px={1}>
                {containError ?
                    <ErrorIcon color="error" sx={{height: '36px', fontSize: '24px'}}/>
                    :
                    <CircleFlag countryCode={countryCode} height="24"/>
                }
                <Typography variant='body1' pl={1}>
                    {countryCode.toUpperCase()}
                </Typography>
                <CancelIcon color="disabled" fontSize='small' sx={{height: '36px', ml: 1.5}} onClick={handleClickOpen}/>
            </Stack>
        </>
    )
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
