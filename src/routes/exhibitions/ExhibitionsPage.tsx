import React, {useEffect, useState} from "react";
import {Avatar, AvatarGroup, Button, Chip, Stack, Typography, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import {EmptyPlaceholder, PageContentContainer, PageTitle, SinglePageColumn} from "../../components/page";
import {BaseTable, BaseTableRow, TableHeadCell} from "../../components/table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import {Exhibition, ExhibitionLang} from "../../model/exhibition";
import {CircleFlag} from "react-circle-flags";
import {useNavigate} from "react-router-dom";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import {exhibitionService} from "../../services/ExhibitionService";
import {useSnackbar} from "notistack";
import ConfirmationDialog from "../../components/dialog/ConfirmationDialog";
import CircularProgress from '@mui/material/CircularProgress';
import QrCodeDialog from "../../components/dialog/QrCodeDialog";
import FilterListIcon from '@mui/icons-material/FilterList';
import {ApiException} from "../../http/types";


const ExhibitionsPage = () => {
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getExhibitionsAsync()
    }, []);

    const getExhibitionsAsync = async () => {
        setLoading(true);
        try {
            const exhibitions = await exhibitionService.getExhibitions({});
            setExhibitions(exhibitions);
        } catch (err) {
            if (err instanceof ApiException) snackbar(`Creating exhibition failed. Status: ${err.statusCode}, message: ${err.message}`, {variant: "error"})
            else snackbar(`Creating exhibition failed.`, {variant: "error"})
        } finally {
            setLoading(false);
        }
    };


    const links = [
        {
            nameKey: "menu.exhibitions",
            path: "/exhibitions"
        }
    ]

    return (
        <Stack width={'100%'}>
            <AppBreadcrumbs links={links}/>
            <PageTitle title={t('exhibitionsPage.title')} subtitle={t('exhibitionsPage.subtitle') as string}/>
            <PageContentContainer>
                <SinglePageColumn>{!loading && !exhibitions || exhibitions.length == 0 ? <NoItems/> : <Stack spacing={2} width="100%">
                    <TableActions reload={getExhibitionsAsync}/>
                    {loading ? <EmptyPlaceholder><CircularProgress/></EmptyPlaceholder> :
                        <BaseTable>
                            <TableHead>
                                <TableRow>
                                    <TableHeadCell>Reference name</TableHeadCell>
                                    <TableHeadCell>Status</TableHeadCell>
                                    <TableHeadCell align="right">Language options</TableHeadCell>
                                    <TableHeadCell align="right"></TableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {exhibitions.map((row, i) => (
                                    <BaseTableRow key={row.id + i}>
                                        <TableCell component="th" scope="row">{row.referenceName}</TableCell>
                                        <TableCell><Chip label={row.status} size="small" variant="outlined" color="primary"/></TableCell>
                                        <TableCell align="right"><LangList langOptions={row.langOptions}/></TableCell>
                                        <TableCell align="right"><RowActions id={row.id} referenceName={row.referenceName} qrCodeUrl={row.qrCodeUrl} reload={getExhibitionsAsync}/></TableCell>
                                    </BaseTableRow>
                                ))}
                            </TableBody>
                        </BaseTable>}
                </Stack>
                }
                </SinglePageColumn>
            </PageContentContainer>
        </Stack>
    )
        ;
};

const LangList = ({langOptions}: {
    langOptions: ExhibitionLang[]
}) => {
    return <AvatarGroup max={5}>
        {
            langOptions.map((opt, i) => {
                return (
                    <Avatar key={opt.lang + i} sx={{width: 32, height: 32, bgcolor: "white"}}>
                        <CircleFlag alt={opt.lang} countryCode={opt.lang} height="28"/>
                    </Avatar>
                )
            })
        }
    </AvatarGroup>
}

const TableActions = ({reload}: { reload: () => Promise<void> }) => {
    const navigate = useNavigate();

    return (
        <Stack direction="row" display="flex" spacing={1} justifyContent="end">
            <Stack direction="row" width="100%" spacing={1}  flexGrow={1} justifyItems="start">
                <Button variant="outlined" onClick={() => reload()} startIcon={<RefreshOutlinedIcon/>}>Refresh</Button>
                <Button variant="outlined" onClick={() => reload()} disabled startIcon={<FilterListIcon/>}>Filter</Button>
            </Stack>
            <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={() => navigate("new")} disableElevation startIcon={<AddOutlinedIcon/>}>Create</Button>
            </Stack>
        </Stack>
    )
}

const RowActions = ({id, referenceName, qrCodeUrl, reload}: {
    id: string,
    referenceName: string,
    qrCodeUrl: string,
    reload: () => Promise<void>
}) => {
    const navigate = useNavigate()
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const [removeExhibitionDialogOpen, setRemoveExhibitionDialogOpen] = useState(false);
    const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState<boolean>(false);

    const handleRemoveExhibitionDialogOpen = () => setRemoveExhibitionDialogOpen(true);
    const handleRemoveExhibitionDialogClose = () => setRemoveExhibitionDialogOpen(false);
    const handleQrCodeDialogOpen = () => setQrCodeDialogOpen(true);
    const handleQrCodeDialogClose = () => setQrCodeDialogOpen(false);

    const deleteExhibition = async (exhibitionId: string) => {
        try {
            await exhibitionService.deleteExhibition(exhibitionId);
            await reload()
            snackbar(`Exhibition id: ${exhibitionId} deleted successfully.`, {variant: "success"})
        } catch (err) {
            snackbar(`Deleting exhibition id: ${exhibitionId} failed.`, {variant: "error"})
        }
    }

    return (
        <>
            <ConfirmationDialog
                title={"Delete exhibitions"}
                description={"Are you sure you want to permanently delete this exhibition? It will also remove all exhibits belonging to this exhibition."}
                open={removeExhibitionDialogOpen}
                handleAgree={() => deleteExhibition(id)}
                handleClose={handleRemoveExhibitionDialogClose}
            />
            <QrCodeDialog open={qrCodeDialogOpen} referenceName={referenceName} qrCodeUrl={qrCodeUrl} handleClose={handleQrCodeDialogClose}/>
            <Stack direction="row" display="flex" spacing={1} justifyContent="end">
                <Button variant="text" startIcon={<DeleteOutlinedIcon/>} onClick={() => handleRemoveExhibitionDialogOpen()}>Delete</Button>
                <Button variant="text" startIcon={<QrCode2Icon/>} onClick={() => handleQrCodeDialogOpen()}>QR Code</Button>
                <Button variant="text" startIcon={<EditOutlinedIcon/>} onClick={() => navigate(`/exhibitions/${id}`)}>Edit</Button>
            </Stack>
        </>
    )
}

const NoItems = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme()

    return (
        <EmptyPlaceholder>
            <Typography variant='body1' fontWeight='bolder'>Brak aktywnych wystaw</Typography>
            <Typography sx={{color: theme.palette.text.secondary, paddingBottom: 2}} variant='subtitle2'>Nie posiadasz żadnej aktywnej wystawy. Kliknij aby dodać nową.</Typography>
            <Button startIcon={<AddOutlinedIcon/>} variant="outlined" onClick={() => navigate("new")}>Dodaj wystawę</Button>
        </EmptyPlaceholder>
    )
}

export default ExhibitionsPage;