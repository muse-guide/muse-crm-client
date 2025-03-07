import React, {useCallback, useEffect, useState} from "react";
import {Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import TextInput from "../../components/form/TextInput";
import {FormProvider, SubmitHandler, useFieldArray, UseFieldArrayReturn, useForm} from "react-hook-form";
import {Exhibit} from "../../model/exhibit";
import {useSnackbar} from "notistack";
import {useNavigate, useParams} from "react-router-dom";
import {exhibitService} from "../../services/ExhibitService";
import {FullRow, Panel} from "../../components/panel";
import {Actions, Page, PageContentContainer, PageTitle, SinglePageColumn} from "../../components/page";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import {ImageHolder, ImageUploaderField} from "../../components/form/ImageUploader";
import {ExhibitionSelect} from "./ExhibitionSelect";
import {LanguageTabs} from "../../components/langOptions/LanguageTabs";
import {LanguageOptionsHolder} from "../../components/form/LanguageSelect";

const defaults = {
    id: "",
    exhibitionId: "",
    referenceName: "",
    number: 1,
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
    const exhibitionId = methods.watch("exhibitionId")

    useEffect(() => {
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
            snackbar(t("error.fetchingExhibitFailed"), {variant: "error"})
            navigate("/exhibits");
        } finally {
            setLoading(false);
        }
    };

    const onExhibitionChange = useCallback(
        (id: string) => {
            methods.setValue("exhibitionId", id)
        },
        [exhibitId]
    )

    const onSubmit: SubmitHandler<Exhibit> = async (data) => {
        if (langOptionMethods.fields.length < 1) {
            snackbar(t("validation.noLanguageOption"), {variant: "error"})
            return
        }
        setProcessing(true);
        try {
            if (exhibitId) {
                await exhibitService.updateExhibit(data)
                navigate("/exhibits");
                snackbar(t("success.exhibitUpdated", {exhibitId: exhibitId}), {variant: "success"})
            } else {
                await exhibitService.createExhibit(data)
                navigate("/exhibits");
                snackbar(t("success.exhibitCreated"), {variant: "success"})
            }
        } catch (err) {
            snackbar(t("error.savingExhibitFailed"), {variant: "error"})
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

    return (
        <Page>
            <FormProvider {...methods} >
                <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
                    <AppBreadcrumbs links={links}/>
                    <PageTitle title={t('page.exhibit.title')} subtitle={t('page.exhibit.subtitle')}/>
                    <PageContentContainer>
                        <SinglePageColumn>
                            <Panel
                                loading={loading}
                                title={t('page.exhibit.generalInfoForm.title')}
                                subtitle={t('page.exhibit.generalInfoForm.subtitle')}
                            >
                                <FullRow>
                                    <ExhibitionSelect
                                        value={exhibitionId}
                                        onChange={onExhibitionChange}
                                        disabled={!!exhibitId}
                                    />
                                </FullRow>
                                <FullRow>
                                    <TextInput
                                        name="referenceName"
                                        title={t('page.exhibit.generalInfoForm.referenceName')}
                                        placeholder={t('page.exhibit.generalInfoForm.referenceNamePlaceholder')}
                                        required
                                        maxLength={128}
                                    />
                                </FullRow>
                                <FullRow>
                                    <TextInput
                                        name="number"
                                        title={t('page.exhibit.generalInfoForm.exhibitNumber')}
                                        subtitle={t('page.exhibit.generalInfoForm.exhibitNumberHelperText')}
                                        placeholder="1"
                                        required
                                        numeric
                                    />
                                </FullRow>
                                <FullRow>
                                    <ImageUploaderField arrayMethods={imagesMethods as unknown as UseFieldArrayReturn<ImageHolder, "images", "id">}/>
                                </FullRow>
                            </Panel>

                            <Panel
                                loading={loading}
                                title={t('page.exhibit.languagesForm.title')}
                                subtitle={t('page.exhibit.languagesForm.subtitle')}
                            >
                                <FullRow>
                                    <LanguageTabs
                                        arrayMethods={langOptionMethods as unknown as UseFieldArrayReturn<LanguageOptionsHolder, "langOptions">}
                                    />
                                </FullRow>
                            </Panel>
                        </SinglePageColumn>

                        <Actions>
                            <Button variant="outlined" onClick={() => navigate("/exhibits")}>{t('common.cancel')}</Button>
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

export default ExhibitPage;