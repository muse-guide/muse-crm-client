import React, {useCallback, useEffect, useState} from "react";
import {Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import TextInput from "../../components/form/TextInput";
import {FormProvider, SubmitHandler, useFieldArray, UseFieldArrayReturn, useForm} from "react-hook-form";
import {Exhibit} from "../../model/exhibit";
import {useSnackbar} from "notistack";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {exhibitService} from "../../services/ExhibitService";
import {FullRow, Panel} from "../../components/panel";
import {Actions, Page, PageContentContainer, PageTitle, SinglePageColumn} from "../../components/page";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import {ImageHolder, ImageUploaderField} from "../../components/form/ImageUploader";
import {ExhibitionSelect} from "./ExhibitionSelect";
import {LanguageTabs} from "../../components/langOptions/LanguageTabs";
import {LanguageOptionsHolder} from "../../components/form/LanguageSelect";
import {useApplicationContext} from "../../components/hooks";
import {useHandleError} from "../../http/errorHandler";


const ExhibitPage = () => {
    const {exhibitId} = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {refreshCustomer} = useApplicationContext()
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const handleError = useHandleError();

    const [loading, setLoading] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);

    const methods = useForm<Exhibit>({
        mode: "onSubmit",
        defaultValues: {
            id: "",
            exhibitionId: searchParams.get("exhibitionId") || "",
            referenceName: "",
            number: 1,
            images: [],
            langOptions: []
        }
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
        } catch (error) {
            handleError("error.fetchingExhibitFailed", error);
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
            snackbar(t("error.noLanguageOption"), {variant: "error"})
            return
        }
        setProcessing(true);
        try {
            if (exhibitId) {
                await exhibitService.updateExhibit(data)
                snackbar(t("success.exhibitUpdated", {exhibitId: exhibitId}), {variant: "success"})
            } else {
                await exhibitService.createExhibit(data)
                snackbar(t("success.exhibitCreated"), {variant: "success"})
            }
        } catch (error) {
            handleError("error.savingExhibitFailed", error);
        } finally {
            refreshCustomer()
            setProcessing(false);
            navigate(`/exhibits?exhibitionId=${exhibitionId}`);
        }
    }

    const links = [
        {
            nameKey: "menu.exhibits",
            path: `/exhibits?exhibitionId=${exhibitionId}`
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
                                title={t('page.languagesForm.title')}
                                subtitle={t('page.languagesForm.subtitle')}
                            >
                                <FullRow>
                                    <LanguageTabs
                                        arrayMethods={langOptionMethods as unknown as UseFieldArrayReturn<LanguageOptionsHolder, "langOptions">}
                                    />
                                </FullRow>
                            </Panel>
                        </SinglePageColumn>

                        <Actions>
                            <Button variant="outlined" onClick={() => navigate(`/exhibits?exhibitionId=${exhibitionId}`)}>{t('common.cancel')}</Button>
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