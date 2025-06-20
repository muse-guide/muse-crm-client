import React, {useEffect, useState} from "react";
import {Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import TextInput from "../../components/form/TextInput";
import {ImageHolder, ImageUploaderField} from "../../components/form/ImageUploader";
import {FormProvider, SubmitHandler, useFieldArray, UseFieldArrayReturn, useForm} from "react-hook-form";
import {Institution} from "../../model/institution";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {institutionService} from "../../services/InstitutionService";
import {FullRow, Panel} from "../../components/panel";
import {Actions, Page, PageContentContainer, PageTitle, SinglePageColumn} from "../../components/page";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import {ApiException} from "../../http/types";
import {LanguageTabs} from "../../components/langOptions/LanguageTabs";
import {LanguageOptionsHolder} from "../../components/form/LanguageSelect";
import {useApplicationContext} from "../../components/hooks";
import {useHandleError} from "../../http/errorHandler";

const defaults = {
    images: [],
    langOptions: []
}

const InstitutionEditPage = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const {refreshCustomer} = useApplicationContext()
    const handleError = useHandleError();

    const [loading, setLoading] = useState<boolean>(false);
    const [hasInstitution, setHasInstitution] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);

    const methods = useForm<Institution>({
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
        getCustomerInstitutionAsync();
    }, []);

    const getCustomerInstitutionAsync = async () => {
        setLoading(true);
        try {
            const institution = await institutionService.getInstitutionForCustomer();
            if (institution) {
                if (institution.status === "PROCESSING") {
                    snackbar(t(`error.institutionUpdateInProgress`), {variant: "error"})
                    navigate("/institution");
                }
                setHasInstitution(true);
                methods.reset(institution);
            } else {
                setHasInstitution(false);
            }
        } catch (error) {
            handleError("error.fetchingInstitutionFailed", error);

            snackbar(t("error.fetchingInstitutionFailed"), {variant: "error"})
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit: SubmitHandler<Institution> = async (data) => {
        if (langOptionMethods.fields.length < 1) {
            snackbar(t("error.noLanguageOption"), {variant: "error"})
            return
        }
        setProcessing(true);
        try {
            if (hasInstitution) {
                await institutionService.updateInstitution(data)
            } else {
                await institutionService.createInstitution(data)
            }
            snackbar(t("success.institutionSaved"), {variant: "success"})
            navigate('/institution')
        } catch (error) {
            handleError("error.savingInstitutionFailed", error);
        } finally {
            refreshCustomer()
            setProcessing(false);
        }
    }

    const links = [
        {
            nameKey: "menu.institution",
            path: "/institution"
        }
    ]

    return (
        <Page>
            <FormProvider {...methods} >
                <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
                    <AppBreadcrumbs links={links}/>
                    <PageTitle title={t('page.institution.title')} subtitle={t('page.institution.subtitle')}/>
                    <PageContentContainer>
                        <SinglePageColumn>
                            <Panel
                                loading={loading}
                                title={t('page.institution.generalInfoForm.title')}
                                subtitle={t('page.institution.generalInfoForm.subtitle')}
                            >
                                <FullRow>
                                    <TextInput
                                        name="referenceName"
                                        title={t('page.institution.generalInfoForm.referenceName')}
                                        placeholder={t('page.institution.generalInfoForm.referenceNamePlaceholder')}
                                        required
                                        maxLength={128}
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
                            <Button variant="outlined" onClick={() => navigate("/institution")}>{t('common.cancel')}</Button>
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

export default InstitutionEditPage;