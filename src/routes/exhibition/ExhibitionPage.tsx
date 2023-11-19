import React, {useEffect, useState} from "react";
import {Box, Button, Stack, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import TextInput from "../../components/form/TextInput";
import {CheckboxInput} from "../../components/form/CheckboxInput";
import {ImageUploaderField} from "../../components/form/ImageUploader";
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
import {FullRow, Panel} from "../../components/panel";
import {Actions, PageContentContainer, PageTitle, PrimaryPageColumn, SecondaryPageColumn} from "../../components/page";

const initialExhibition: Exhibition = {
    id: "",
    institutionId: "abea222c-adf8-4334-a9ac-7da42a2ed410",
    referenceName: "",
    qrCodeUrl: "",
    includeInstitutionInfo: false,
    images: [],
    langOptions: []
}

const ExhibitionPage = () => {
    const {exhibitionId} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
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
        } catch (err) {
            navigate("/error");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit: SubmitHandler<Exhibition> = async (data) => {
        console.log(data);
        if (langOptionMethods.fields.length < 1) {
            snackbar("Your must provide at least one language for collection...", {variant: "error"})
            return
        }
        try {
            if (exhibitionId) {
                snackbar(`Updating collection ${exhibitionId}`, {variant: "success"})
            } else {
                const createdExhibition = await exhibitionService.createExhibition(data)
                methods.reset(createdExhibition);
                snackbar(`New collection created`, {variant: "success"})
            }
        } catch (err) {
            navigate("/error");
        } finally {
            setLoading(false);
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
                <AppBreadcrumbs links={links}/>
                <PageTitle title={t('exhibitionPage.title')}/>
                <PageContentContainer>
                    <PrimaryPageColumn>
                        <Panel
                            loading={loading}
                            title="Podstawowe informacje"
                            subtitle="Podaj podstawowe informacje dotyczące wystawy, jak nazwę której będziesz używał, żeby dodawać eksponaty do kolekcji. Tu dodasz także zdjęcia, które pojawią się w aplikacji mobilej."
                        >
                            <FullRow>
                                <TextInput
                                    name="referenceName"
                                    title="Nazwa własna"
                                    placeholder="Moja wielka wystawa"
                                    required
                                    maxLength={20}
                                />
                            </FullRow>
                            <FullRow>
                                <CheckboxInput
                                    name="includeInstitutionInfo"
                                    control={methods.control}
                                    defaultChecked={true}
                                    label="Pokaż odnośnik do Twojej instytucji. Kiedy opcja zaznaczona, w aplikacji mobilnej pojawi się przycisk który przenisie użytkownika do strony z informacjami o instytucji."/>
                            </FullRow>
                            <FullRow>
                                <ImageUploaderField arrayMethods={imagesMethods}/>
                            </FullRow>
                        </Panel>

                        <Panel
                            loading={loading}
                            title="Opcje językowe"
                            subtitle="Dodaj informacje o kolekcji, które będą dostępne w wybranych przez Ciebie językach. Dodając tutaj języki, definiujesz także w jakich językach będą dostępne eksponaty należące do kolekcji."
                        >
                            <FullRow>
                                <LanguageTabs arrayMethods={langOptionMethods}/>
                            </FullRow>
                        </Panel>
                    </PrimaryPageColumn>

                    <SecondaryPageColumn>
                        <Panel
                            loading={loading}
                            skeletonHeight={570}
                            title="Kod QR"
                            subtitle="Unikalny kod QR służący do przeniesienia Zwiedzającego na stronę wystawy. Zostanie wygenerowany po zapisaniu kolekcji. Wybierz jedną z dostępnych opcji aby go wybrukować i umieścić w widocznym miejscu."
                        >
                            {
                                exhibitionId ?
                                    <FullRow justifyContent="center" display="flex">
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
                                    </FullRow>
                                    :
                                    <FullRow justifyContent="center" display="flex">
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
                                    </FullRow>
                            }
                            <FullRow justifyContent="center" display="flex">
                                <Stack direction="row" spacing={2} display="flex" justifyContent="end" pb={1}>
                                    <Button variant="outlined" disabled={!exhibitionId} startIcon={<PhotoIcon fontSize='medium'/>}>png</Button>
                                    <Button variant="outlined" disabled={!exhibitionId} startIcon={<PictureAsPdfIcon fontSize='medium'/>}>pdf</Button>
                                    <Button variant="outlined" disabled={!exhibitionId} startIcon={<CropIcon fontSize='medium'/>}>Dopasuj</Button>
                                </Stack>
                            </FullRow>
                        </Panel>
                    </SecondaryPageColumn>

                    <Actions>
                        <Button variant="text">Anuluj</Button>
                        <Button variant="outlined">Podgląd aplikacji</Button>
                        <Button variant="contained" disableElevation type={"submit"} onClick={checkErrorsBeforeSubmission}>Zapisz</Button>
                    </Actions>

                </PageContentContainer>
            </form>
        </FormProvider>
    );
};

export default ExhibitionPage;