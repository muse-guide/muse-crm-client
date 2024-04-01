import React, {useEffect, useState} from "react";
import {Button, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import TextInput from "../../components/form/TextInput";
import {FormProvider, SubmitHandler, useFieldArray, UseFieldArrayReturn, useForm} from "react-hook-form";
import {Exhibit} from "../../model/exhibit";
import {useSnackbar} from "notistack";
import {useNavigate, useParams} from "react-router-dom";
import {exhibitService} from "../../services/ExhibitService";
import {FullRow, Panel} from "../../components/panel";
import {Actions, PageContentContainer, PageTitle, SinglePageColumn} from "../../components/page";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import {ApiException} from "../../http/types";
import {ExhibitionSelect} from "./ExhibitionSelect";
import {ImageHolder, ImageUploaderField} from "../../components/form/ImageUploader";
import {LanguageTabs} from "./ExhibtLanguageTabs";

const defaults = {
    id: "",
    exhibitionId: "",
    referenceName: "",
    qrCodeUrl: "",
    images: [],
    langOptions: []
}

const ExhibitPage = () => {
    const {exhibitId} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const methods = useForm<Exhibit>({
        mode: "onSubmit",
        defaultValues: defaults
    });
    const langOptionMethods = useFieldArray({
        shouldUnregister: false,
        control: methods.control,
        name: "langOptions",
    })
    const imagesMethods = useFieldArray({
        control: methods.control,
        name: "images",
        keyName: "fieldId"
    });

    useEffect(() => {
        methods.reset(defaults)
        if (exhibitId) {
            getExhibitAsync(exhibitId);
        }
    }, [exhibitId]);

    const getExhibitAsync = async (exhibitId?: string) => {
        if (!exhibitId) return;
        setLoading(true);
        try {
            const exhibit = await exhibitService.getExhibit(exhibitId);
            methods.reset(exhibit);
        } catch (err) {
            if (err instanceof ApiException) snackbar(`Loading exhibit failed. Status: ${err.statusCode}, message: ${err.message}`, {variant: "error"})
            else snackbar(`Loading exhibit failed.`, {variant: "error"})
        } finally {
            setLoading(false);
        }
    };

    const onSubmit: SubmitHandler<Exhibit> = async (data) => {
        if (langOptionMethods.fields.length < 1) {
            snackbar("Your must provide at least one language for collection...", {variant: "error"})
            return
        }
        setProcessing(true);
        try {
            console.log(JSON.stringify(data, null, 4))
            if (exhibitId) {
                await exhibitService.updateExhibit(data)
                methods.reset(defaults);
                navigate("/exhibits");
                snackbar(`Exhibit ${exhibitId} updated`, {variant: "success"})
            } else {
                await exhibitService.createExhibit(data)
                methods.reset(defaults);
                navigate("/exhibits");
                snackbar(`New collection created`, {variant: "success"})
            }
        } catch (err) {
            if (err instanceof ApiException) snackbar(`Creating exhibit failed. Status: ${err.statusCode}, message: ${err.message}`, {variant: "error"})
            else snackbar(`Creating exhibit failed.`, {variant: "error"})
        } finally {
            setProcessing(false);
        }
    }

    const links = [
        {
            nameKey: "menu.exhibits",
            path: "/exhibits"
        },
        {
            nameKey: `${!exhibitId ? "..." : methods.getValues("referenceName")}`,
            path: ""
        },
    ]
    imagesMethods.fields.forEach(item => console.log("test", item.id))

    return (
        <FormProvider {...methods} >
            <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
                <AppBreadcrumbs links={links}/>
                <PageTitle title={t('exhibitPage.title')}/>
                <PageContentContainer>
                    <SinglePageColumn>
                        <Panel
                            loading={loading}
                            title="Podstawowe informacje"
                            subtitle="Przypisz eksponat do koleckji oraz nadaj mu nazwę. Tu dodasz także zdjęcia, które pojawią się w aplikacji mobilej."
                        >
                            <FullRow>
                                <ExhibitionSelect methods={methods} disabled={!!exhibitId}/>
                            </FullRow>
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
                                <ImageUploaderField arrayMethods={imagesMethods as unknown as UseFieldArrayReturn<ImageHolder, "images", "id">}/>
                            </FullRow>
                        </Panel>

                        <Panel
                            loading={loading}
                            title="Opcje językowe"
                            subtitle="Dodaj informacje o eksponacie, które będą dostępne w wybranych przez Ciebie językach."
                        >
                            <FullRow>
                                <LanguageTabs arrayMethods={langOptionMethods}/>
                            </FullRow>
                        </Panel>
                    </SinglePageColumn>

                    <Actions>
                        <Button variant="text" onClick={() => navigate("/exhibits")}>Anuluj</Button>
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

export default ExhibitPage;