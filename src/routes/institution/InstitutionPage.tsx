import React, {useEffect, useState} from "react";
import {Button, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import {FormProvider, useForm} from "react-hook-form";
import {useSnackbar} from "notistack";
import {FullRow, HalfRow, Panel} from "../../components/panel";
import {Page, PageContentContainer, PageTitle, SinglePageColumn} from "../../components/page";
import {Label} from "../../components/form/Label";
import {StatusChip} from "../../components/table";
import {Status} from "../../model/common";
import {Institution} from "../../model/institution";
import {institutionService} from "../../services/InstitutionService";
import {useNavigate} from "react-router-dom";
import LanguageFlag from "../../components/LaungageFlag";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import AppDialog from "../../components/dialog/AppDialog";
import useDialog from "../../components/hooks";
import QrCodeDialog from "../../components/dialog/QrCodeDialog";
import QrCode2Icon from "@mui/icons-material/QrCode2";


const InstitutionPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const appDialog = useDialog()
    const qrCodeDialog = useDialog()

    const methods = useForm<Institution>({
        mode: "onSubmit",
        defaultValues: {}
    });

    useEffect(() => {
        getCustomerInstitutionAsync();
    }, []);

    const getCustomerInstitutionAsync = async () => {
        setLoading(true);
        try {
            const institution = await institutionService.getInstitutionForCustomer();
            if (institution) {
                methods.reset(institution);
            } else {
                navigate("edit")
            }
        } catch (err) {
            snackbar(t("error.fetchingInstitutionFailed"), {variant: "error"})
        } finally {
            setLoading(false);
        }
    };

    const links = [
        {
            nameKey: "menu.institution",
            path: "/institution"
        }
    ]

    return (
        <Page>
            <FormProvider {...methods} >
                <form noValidate>
                    <AppBreadcrumbs links={links}/>
                    <Stack maxWidth="1024px" minWidth="540px" direction="row" display="flex" spacing={1} justifyContent="end" alignItems="center">
                        <Stack direction="row" width="100%" spacing={1} flexGrow={1} justifyItems="start">
                            <PageTitle title={t('Institution')} subtitle={t('Manage your Institution')}/>
                        </Stack>
                        <Stack direction="row" spacing={1} justifyItems={"end"}>
                            <Button variant="outlined" size={"medium"} onClick={getCustomerInstitutionAsync} sx={{minWidth: "32px"}}><RefreshOutlinedIcon/></Button>
                            <Button startIcon={<PhoneIphoneIcon/>} size={"medium"} variant="outlined" onClick={appDialog.openDialog}>{t('Preview')}</Button>
                            <Button startIcon={<QrCode2Icon/>} size={"medium"} variant="outlined" onClick={qrCodeDialog.openDialog} sx={{minWidth: "120px"}}>{t('QR code')}</Button>
                            <Button startIcon={<EditOutlinedIcon/>} size={"medium"} variant="contained" disableElevation onClick={() => navigate("edit")}>{t('common.edit')}</Button>
                        </Stack>
                    </Stack>
                    <PageContentContainer>
                        <AppDialog
                            open={appDialog.isOpen}
                            path={`institutions/${methods.getValues('id')}`}
                            handleClose={appDialog.closeDialog}
                        />
                        <QrCodeDialog
                            open={qrCodeDialog.isOpen}
                            referenceName={methods.getValues("referenceName")}
                            resourceId={methods.getValues("id")}
                            handleClose={qrCodeDialog.closeDialog}
                        />
                        <SinglePageColumn maxWidth='1024px'>
                            <Panel
                                loading={loading}
                                title={t('Institution overview')}
                                subtitle={t('General information about your institution, click edit to change details')}
                                skeletonHeight={264}
                            >
                                <FullRow>
                                    <Label label={t('Reference name')} value={methods.getValues("referenceName")}/>
                                </FullRow>
                                <HalfRow>
                                    <Stack spacing={1} display={"block"}>
                                        <Typography variant='body1'>{t('Institution status')}</Typography>
                                        <StatusChip status={methods.getValues("status") as Status} size="small"/>
                                    </Stack>
                                </HalfRow>
                                <HalfRow>
                                    <Stack spacing={1} display={"block"}>
                                        <Typography variant='body1'>{t('Languages')}</Typography>
                                        <Stack direction={"row"} spacing={1}>
                                            {methods.getValues("langOptions")?.map((opt, index) => (
                                                <LanguageFlag countryCode={opt.lang} size={20}/>
                                            ))}
                                        </Stack>
                                    </Stack>
                                </HalfRow>
                            </Panel>
                        </SinglePageColumn>
                    </PageContentContainer>
                </form>
            </FormProvider>
        </Page>
    );
};

export default InstitutionPage;