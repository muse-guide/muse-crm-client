import React, {useEffect, useState} from "react";
import {Button, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import TextInput from "../../components/form/TextInput";
import {CheckboxInput} from "../../components/form/CheckboxInput";
import {ImageHolder, ImageUploaderField} from "../../components/form/ImageUploader";
import {FormProvider, SubmitHandler, useFieldArray, UseFieldArrayReturn, useForm} from "react-hook-form";
import {Exhibition} from "../../model/exhibition";
import {useSnackbar} from "notistack";
import {useNavigate, useParams} from "react-router-dom";
import {exhibitionService} from "../../services/ExhibitionService";
import {FullRow, Panel} from "../../components/panel";
import {Actions, Page, PageContentContainer, PageTitle, SinglePageColumn} from "../../components/page";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import {ApiException} from "../../http/types";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import {LanguageTabs} from "../../components/langOptions/LanguageTabs";
import {ExhibitionLanguageSpecificForm} from "./ExhibtionLanguageTabs";
import {LanguageOptionsHolder} from "../../components/form/LanguageSelect";

const defaults = {
    id: "abea222c",
    institutionId: "abea222c", // TODO get from user context?
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
    const [processing, setProcessing] = useState<boolean>(false);
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const methods = useForm<Exhibition>({
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
        if (exhibitionId) {
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
            snackbar(t("error.fetchingExhibitionFailed"), {variant: "error"})
        } finally {
            setLoading(false);
        }
    };

    const onSubmit: SubmitHandler<Exhibition> = async (data) => {
        if (langOptionMethods.fields.length < 1) {
            snackbar(t("validation.noLanguageOption"), {variant: "error"})
            return
        }
        setProcessing(true);
        try {
            if (exhibitionId) {
                await exhibitionService.updateExhibition(data)
                navigate("/exhibitions");
                snackbar(t("success.exhibitionUpdated", {exhibitionId: exhibitionId}), {variant: "success"})
            } else {
                await exhibitionService.createExhibition(data)
                navigate("/exhibitions");
                snackbar(t("success.exhibitionCreated"), {variant: "success"})
            }
        } catch (err) {
            if (err instanceof ApiException) snackbar(`Creating exhibition failed. Status: ${err.statusCode}, message: ${err.message}`, {variant: "error"})
            else snackbar(`Creating exhibition failed.`, {variant: "error"})
        } finally {
            setProcessing(false);
        }
    }

    const links = [
        {
            nameKey: "menu.exhibitions",
            path: "/exhibitions"
        },
        {
            nameKey: `${!exhibitionId ? "..." : methods.getValues("referenceName")}`,
            path: ""
        },
    ]

    const theme = useTheme()

    return (
        <Page>
            <FormProvider {...methods} >
                <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
                    <AppBreadcrumbs links={links}/>
                    <PageTitle title={t('page.exhibition.title')} subtitle={t('page.exhibition.subtitle')}/>
                    <PageContentContainer>
                        <SinglePageColumn>
                            <Panel
                                loading={loading}
                                title={t('page.exhibition.generalInfoForm.title')}
                                subtitle={t('page.exhibition.generalInfoForm.subtitle')}
                            >
                                <FullRow>
                                    <TextInput
                                        name="referenceName"
                                        title={t('page.exhibition.generalInfoForm.referenceName')}
                                        placeholder={t('page.exhibition.generalInfoForm.referenceNamePlaceholder')}
                                        required
                                        maxLength={128}
                                    />
                                </FullRow>
                                <FullRow>
                                    <CheckboxInput
                                        name="includeInstitutionInfo"
                                        control={methods.control}
                                        defaultChecked={true}
                                        label={t('page.exhibition.generalInfoForm.includeInstitutionInfoHelperText')}
                                    />
                                </FullRow>
                                <FullRow>
                                    <ImageUploaderField arrayMethods={imagesMethods as unknown as UseFieldArrayReturn<ImageHolder, "images", "id">}/>
                                </FullRow>
                            </Panel>

                            <Panel
                                loading={loading}
                                title={t('page.exhibition.languagesForm.title')}
                                subtitle={t('page.exhibition.languagesForm.subtitle')}
                            >
                                <FullRow>
                                    <LanguageTabs
                                        arrayMethods={langOptionMethods as unknown as UseFieldArrayReturn<LanguageOptionsHolder, "langOptions">}
                                        FormComponent={ExhibitionLanguageSpecificForm}
                                    />
                                </FullRow>
                            </Panel>
                        </SinglePageColumn>

                        <Actions>
                            <Button variant="text" onClick={() => navigate("/exhibitions")}>{t('common.cancel')}</Button>
                            <Button variant="outlined" disabled startIcon={<PhoneIphoneIcon/>}>{t('page.common.appPreview')}</Button>
                            <LoadingButton
                                key="submitButton"
                                variant="contained"
                                disableElevation
                                type="submit"
                                loading={processing}
                                loadingPosition="start"
                                startIcon={<SaveIcon/>}
                            >
                                {t('common.save')}
                            </LoadingButton>
                        </Actions>

                    </PageContentContainer>
                </form>
            </FormProvider>
        </Page>
    );
};

export default ExhibitionPage;