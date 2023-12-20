import React, {useEffect, useState} from "react";
import {Button, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import TextInput from "../../components/form/TextInput";
import {CheckboxInput} from "../../components/form/CheckboxInput";
import {ImageUploaderField} from "../../components/form/ImageUploader";
import {FormProvider, SubmitHandler, useFieldArray, useForm} from "react-hook-form";
import {Exhibition} from "../../model/exhibition";
import {LanguageTabs} from "./ExhibtionLanguageTabs";
import {useSnackbar} from "notistack";
import {useNavigate, useParams} from "react-router-dom";
import {exhibitionService} from "../../services/ExhibitionService";
import {FullRow, Panel} from "../../components/panel";
import {Actions, PageContentContainer, PageTitle, SinglePageColumn} from "../../components/page";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

const new_item = "new"

const initialExhibition: Exhibition = {
    id: new_item,
    institutionId: "abea222c-adf8-4334-a9ac-7da42a2ed410",
    referenceName: "",
    qrCodeUrl: "",
    includeInstitutionInfo: false,
    images: [],
    langOptions: [],
    status: "ACTIVE"
}

const ExhibitionPage = () => {
    const {exhibitionId} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
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
        if (exhibitionId != new_item) {
            getExhibitionAsync(exhibitionId);
        }
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
        if (langOptionMethods.fields.length < 1) {
            snackbar("Your must provide at least one language for collection...", {variant: "error"})
            return
        }
        setProcessing(true);
        try {
            if (exhibitionId && exhibitionId != new_item) {
                await exhibitionService.updateExhibition(data)
                methods.reset(initialExhibition);
                navigate("/exhibitions");
                snackbar(`Exhibition ${exhibitionId} updated`, {variant: "success"})
            } else {
                await exhibitionService.createExhibition(data)
                methods.reset(initialExhibition);
                navigate("/exhibitions");
                snackbar(`New collection created`, {variant: "success"})
            }
        } catch (err) {
            navigate("/error");
        } finally {
            setProcessing(false);
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
            nameKey: `${exhibitionId == new_item ? "..." : methods.getValues("referenceName")}`,
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
                    <SinglePageColumn>
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
                    </SinglePageColumn>

                    <Actions>
                        <Button variant="text" onClick={() => navigate("/exhibitions")}>Anuluj</Button>
                        <Button variant="outlined">Podgląd aplikacji</Button>
                        <LoadingButton
                            key="submitButton"
                            variant="contained"
                            disableElevation
                            type="submit"
                            loading={processing}
                            loadingPosition="start"
                            startIcon={<SaveIcon/>}
                        >
                            Zapisz
                        </LoadingButton>
                    </Actions>

                </PageContentContainer>
            </form>
        </FormProvider>
    );
};

export default ExhibitionPage;