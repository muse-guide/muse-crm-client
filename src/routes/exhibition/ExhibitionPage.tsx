import React, {useEffect, useState} from "react";
import {Box, Button, Paper, Skeleton, Stack, Typography, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import Grid from "@mui/material/Unstable_Grid2";
import TextInput from "../../components/TextInput";
import {CheckboxInput} from "../../components/CheckboxInput";
import {ImageUploaderField} from "../../components/ImageUploader";
import {FormProvider, SubmitHandler, useFieldArray, useForm} from "react-hook-form";
import {Exhibition} from "../../model/Exhibition";
import {LanguageTabs} from "./ExhibtionLanguageTabs";
import {useSnackbar} from "notistack";
import {useNavigate, useParams} from "react-router-dom";
import {exhibitionService} from "../../services/ExhibitionService";
import {grey} from "@mui/material/colors";
import PhotoIcon from '@mui/icons-material/Photo';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CropIcon from '@mui/icons-material/Crop';
import QrCode2Icon from '@mui/icons-material/QrCode2';

const initialExhibition: Exhibition = {
    id: "",
    institutionId: "",
    referenceName: "",
    qrCodeUrl: "",
    includeInstitutionInfo: false,
    images: [],
    langOptions: []
}

const ExhibitionPage = () => {
    const {exhibitionId} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const methods = useForm<Exhibition>({
        mode: "onSubmit",
        defaultValues: initialExhibition
    });
    const langOptionMethods = useFieldArray({
        shouldUnregister: false,
        control: methods.control,
        name: "langOptions",
    })
    const imagesMethods = useFieldArray({
        control: methods.control,
        name: "images",
    });

    useEffect(() => {
        methods.reset(initialExhibition)
        getExhibitionAsync(exhibitionId);
    }, [exhibitionId]);

    const getExhibitionAsync = async (exhibitionId?: string) => {
        if (!exhibitionId) return;
        setLoading(true);
        try {
            const exhibition = await exhibitionService.getExhibition(exhibitionId);
            methods.reset(exhibition);
            console.log(exhibition)
        } catch (err) {
            navigate("/error");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit: SubmitHandler<Exhibition> = (data) => {
        console.log(data);
        if (langOptionMethods.fields.length < 1) {
            snackbar("Your must provide at least one language for collection...", {variant: "error"})
            return
        }
        if (exhibitionId) {
            snackbar(`Updating collection ${exhibitionId}`, {variant: "success"})
        } else {
            snackbar(`Creating new collection`, {variant: "success"})
        }
    }

    const checkErrorsBeforeSubmission = async () => {
        methods.trigger().then(r => {
            if (!methods.formState.isValid) {
                snackbar("Form contains errors...", {variant: "error"})
            }
        })
    }

    const links = [
        {
            nameKey: "menu.exhibitions",
            path: "/exhibitions"
        },
        {
            nameKey: `${methods.getValues("referenceName")}`,
            path: ""
        },
    ]

    const theme = useTheme()

    return (
        <FormProvider {...methods} >
            <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
                <Stack>
                    <AppBreadcrumbs links={links}/>
                    <Typography variant='h4' pt={4.5} pb={3} fontWeight='bolder'>{t('exhibitionPage.title')}</Typography>
                    <Grid container spacing={4}>
                        <Grid xs={12} xl={6.5} minWidth="540px" maxWidth="900px">
                            <Stack spacing={4}>
                                {loading ? <Skeleton variant="rectangular" height={400} sx={{display: 'flex'}}/> :
                                    <Paper elevation={2}>
                                        <Grid container spacing={3} p={3}>
                                            <Grid xs={12}>
                                                <Stack spacing={1}>
                                                    <Typography variant='h6' fontWeight='bolder'>Podstawowe informacje</Typography>
                                                    <Typography variant='subtitle2'>Podaj podstawowe informacje dotyczące wystawy, jak nazwę której będziesz używał, żeby dodawać eksponaty do kolekcji. Tu dodasz także zdjęcia, które pojawią się w aplikacji mobilej.</Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid xs={12}>
                                                <TextInput
                                                    name="referenceName"
                                                    title="Nazwa własna"
                                                    placeholder="Moja wielka wystawa"
                                                    required
                                                    maxLength={20}
                                                />
                                            </Grid>
                                            <Grid xs={12}>
                                                <CheckboxInput
                                                    name="includeInstitutionInfo"
                                                    control={methods.control}
                                                    defaultChecked={true}
                                                    label="Pokaż odnośnik do Twojej instytucji. Kiedy opcja zaznaczona, w aplikacji mobilnej pojawi się przycisk który przenisie użytkownika do strony z informacjami o instytucji."/>
                                            </Grid>
                                            <Grid xs={12}>
                                                <ImageUploaderField arrayMethods={imagesMethods}/>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                }
                                {loading ? <Skeleton variant="rectangular" height={400}/> :
                                    <Paper elevation={2}>
                                        <Grid container spacing={3} p={3}>
                                            <Grid xs={12}>
                                                <Stack spacing={1}>
                                                    <Typography variant='h6' fontWeight='bolder'>Opcje językowe</Typography>
                                                    <Typography variant='subtitle2'>Dodaj informacje o kolekcji, które będą dostępne w wybranych przez Ciebie językach. Dodając tutaj języki, definiujesz także w jakich językach będą dostępne eksponaty należące do
                                                        kolekcji.</Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid xs={12}>
                                                <LanguageTabs arrayMethods={langOptionMethods}/>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                }
                            </Stack>
                        </Grid>

                        <Grid xs={12} xl={4.5} minWidth="200px" maxWidth="900px">
                            <Stack spacing={3}>
                                {loading ? <Skeleton variant="rectangular" height={570}/> :
                                    <Paper elevation={2}>
                                        <Grid container spacing={3} p={3}>
                                            <Grid xs={12}>
                                                <Stack spacing={1}>
                                                    <Typography variant='h6' fontWeight='bolder'>Kod QR</Typography>
                                                    <Typography variant='subtitle2'>Unikalny kod QR służący do przeniesienia Zwiedzającego na stronę wystawy. Zostanie wygenerowany po zapisaniu kolekcji. Wybierz jedną z dostępnych opcji aby go wybrukować i umieścić w widocznym
                                                        miejscu.</Typography>
                                                </Stack>
                                            </Grid>
                                            {
                                                exhibitionId ?
                                                    <Grid xs={12} justifyContent="center" display="flex">
                                                        <Box
                                                            component="img"
                                                            sx={{
                                                                width: 280,
                                                                height: 280,
                                                                borderColor: grey[800],
                                                            }}
                                                            alt="Not found..."
                                                            src={methods.getValues("qrCodeUrl")}
                                                        />
                                                    </Grid>
                                                    :
                                                    <Grid xs={12} justifyContent="center" display="flex">
                                                        <Stack
                                                            sx={{
                                                                width: 280,
                                                                height: 280,
                                                                border: 1,
                                                                borderStyle: "dashed",
                                                                borderColor: theme.palette.grey[600],
                                                                backgroundColor: theme.palette.grey[50],
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                display: "flex"
                                                            }}>
                                                            <QrCode2Icon color="disabled" sx={{fontSize: "80px"}}/>
                                                        </Stack>
                                                    </Grid>
                                            }
                                            <Grid xs={12} justifyContent="center" display="flex">
                                                <Stack direction="row" spacing={2} display="flex" justifyContent="end" pb={1}>
                                                    <Button variant="outlined" disabled={!exhibitionId} startIcon={<PhotoIcon fontSize='medium'/>}>png</Button>
                                                    <Button variant="outlined" disabled={!exhibitionId} startIcon={<PictureAsPdfIcon fontSize='medium'/>}>pdf</Button>
                                                    <Button variant="outlined" disabled={!exhibitionId} startIcon={<CropIcon fontSize='medium'/>}>Dopasuj</Button>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                }
                            </Stack>
                        </Grid>

                        <Grid xs={12} xl={6.5} minWidth="540px" maxWidth="900px">
                            <Stack direction="row" spacing={2} display="flex" justifyContent="end" pb={4}>
                                <Button variant="text">Anuluj</Button>
                                <Button variant="outlined">Podgląd aplikacji</Button>
                                <Button variant="contained" type={"submit"} onClick={checkErrorsBeforeSubmission}>Zapisz</Button>
                            </Stack>
                        </Grid>

                    </Grid>
                </Stack>
            </form>
        </FormProvider>
    );
};

export default ExhibitionPage;