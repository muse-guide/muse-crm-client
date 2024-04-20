import React, {useCallback, useEffect, useState} from "react";
import {Avatar, AvatarGroup, Box, Button, Chip, FormControl, IconButton, InputAdornment, MenuItem, Select, Stack, TextField, Typography, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import {PageContentContainer, PageTitle, SinglePageColumn} from "../../components/page";
import {BaseTable, BaseTableRow, TableHeadCell} from "../../components/table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import {Exhibit} from "../../model/exhibit";
import {CircleFlag} from "react-circle-flags";
import {useNavigate} from "react-router-dom";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import {exhibitService} from "../../services/ExhibitService";
import {useSnackbar} from "notistack";
import ConfirmationDialog from "../../components/dialog/ConfirmationDialog";
import CircularProgress from '@mui/material/CircularProgress';
import QrCodeDialog from "../../components/dialog/QrCodeDialog";
import {ApiException} from "../../http/types";
import {ImageRef, langMap, Status} from "../../model/common";
import DoneIcon from '@mui/icons-material/Done';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {ExhibitionSelect} from "./ExhibitionSelect";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ClearIcon from '@mui/icons-material/Clear';
import {assetService} from "../../services/AssetService";
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';

export interface ExhibitsFilter {
    exhibitionId: string,
    referenceNamePrefix?: string
}

const links = [{
    nameKey: "menu.exhibits",
    path: "/exhibits"
}]

const ExhibitsPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {enqueueSnackbar: snackbar} = useSnackbar();

    const [exhibits, setExhibits] = useState<Exhibit[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [filters, setFilters] = useState<ExhibitsFilter>({exhibitionId: ""})
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [keys, setKeys] = useState<(string | undefined)[]>([undefined]);

    useEffect(() => {
        if (!filters.exhibitionId || (filters.referenceNamePrefix && filters.referenceNamePrefix.length < 3)) return
        getExhibitsAsync()
    }, [filters, page, pageSize]);

    const getExhibitsAsync = async () => {
        setLoading(true);
        try {
            const searchParams = {
                filters: filters,
                pagination: {
                    pageSize: pageSize,
                    nextPageKey: keys[page]
                },
            }
            const results = await exhibitService.getExhibits(searchParams)

            setExhibits(results.items as Exhibit[]);
            if (results.nextPageKey) {
                const tmpKeys = keys
                tmpKeys[page + 1] = results.nextPageKey
                setKeys(tmpKeys)
            }
        } catch (err) {
            if (err instanceof ApiException) snackbar(`Creating exhibit failed. Status: ${err.statusCode}, message: ${err.message}`, {variant: "error"})
            else snackbar(`Creating exhibit failed.`, {variant: "error"})
        } finally {
            setLoading(false);
        }
    };

    const resetPage = () => {
        setPage(0)
        setKeys([undefined])
    }

    const filterResults = (key: string, value: any) => {
        resetPage()
        setFilters({
            ...filters,
            [key]: value
        })
    }

    const nextPage = () => setPage(page + 1)
    const prevPage = () => setPage(page - 1)

    const onPageSizeChange = (pageSize: number) => {
        setPageSize(pageSize)
        resetPage()
    }

    const onRowDelete = () => {
        resetPage()
        getExhibitsAsync()
    }

    const showEmptyResults = (!exhibits || exhibits.length == 0) && !!filters.exhibitionId

    return (
        <Stack width={'100%'}>
            <AppBreadcrumbs links={links}/>
            <Stack maxWidth="1100px" direction="row" display="flex" spacing={1} justifyContent="end" alignItems="center">
                <Stack direction="row" width="100%" spacing={1} flexGrow={1} justifyItems="start">
                    <PageTitle title={t('Exhibits')} subtitle={t('Manage your exhibits') as string}/>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" size={"large"} onClick={getExhibitsAsync}><RefreshOutlinedIcon/></Button>
                    <Button variant="contained" onClick={() => navigate("new")} disableElevation startIcon={<AddOutlinedIcon/>}>Create</Button>
                </Stack>
            </Stack>
            <PageContentContainer>
                <SinglePageColumn maxWidth="1100px">
                    <Stack direction="row" spacing={1} display="flex" alignItems="center">
                        <Box width={"30%"}>
                            <ExhibitionSelect
                                value={filters.exhibitionId}
                                onChange={id => filterResults("exhibitionId", id)}
                                disabled={false}
                            />
                        </Box>
                        <Box width={"40%"}>
                            <SearchTextField
                                value={filters.referenceNamePrefix}
                                onChange={filterResults}
                            />
                        </Box>
                    </Stack>

                    <BaseTable size={"small"}>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell width={"30%"}><Typography variant="overline" fontWeight="bold">Reference name</Typography></TableHeadCell>
                                <TableHeadCell align="right"><Typography variant="overline" fontWeight="bold">Number</Typography></TableHeadCell>
                                <TableHeadCell align="right"><Typography variant="overline" fontWeight="bold">Status</Typography></TableHeadCell>
                                <TableHeadCell align="right"><Typography variant="overline" fontWeight="bold">Language option</Typography></TableHeadCell>
                                <TableHeadCell align="right"><Typography variant="overline" fontWeight="bold">Audio</Typography></TableHeadCell>
                                <TableHeadCell align="right"></TableHeadCell>
                            </TableRow>
                        </TableHead>
                        {loading ? <Loading/> :
                            <TableBody>
                                {exhibits.map((row, i) => (
                                    <BaseTableRow key={row.id + i} hover>
                                        <TableCell component="th" scope="row">
                                            <ResourceAvatar referenceName={row.referenceName} images={row.images} status={row.status}/>
                                        </TableCell>
                                        <TableCell align="right">{row.number}</TableCell>
                                        <TableCell align="right"><StatusChip status={row.status}/></TableCell>
                                        <TableCell align="right"><LangOptions langOptions={row.langOptions}/></TableCell>
                                        <TableCell align="right"><AudioOptions langOptions={row.langOptions}/></TableCell>
                                        <TableCell align="right"><RowActions id={row.id} referenceName={row.referenceName} qrCodeUrl={row.qrCodeUrl} reload={onRowDelete}/></TableCell>
                                    </BaseTableRow>
                                ))}
                                {showEmptyResults && <NoItems/>}

                                <Pagination
                                    page={page}
                                    pageSize={pageSize}
                                    keys={keys}
                                    onNextPage={nextPage}
                                    onPrevPage={prevPage}
                                    onPageSizeChange={onPageSizeChange}
                                />
                            </TableBody>}
                    </BaseTable>
                </SinglePageColumn>
            </PageContentContainer>
        </Stack>
    );
};

const SearchTextField = ({value, onChange}: { value?: string, onChange: (key: string, value?: string) => void }) => {
    return (
        <FormControl size={"small"} fullWidth>
            <Typography variant='body1' pb={1}>Reference name</Typography>
            <TextField
                size="small"
                placeholder={"Reference name starts with..."}
                value={value ?? ""}
                onChange={event => onChange("referenceNamePrefix", event.target.value)}
                InputProps={{
                    endAdornment: <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => onChange("referenceNamePrefix", undefined)}>
                            <ClearIcon/>
                        </IconButton>
                    </InputAdornment>
                }}
                required
            >
            </TextField>
        </FormControl>
    )
}

const ResourceAvatar = ({referenceName, images, status}: { referenceName: string, images: ImageRef[], status: Status }) => {
    const theme = useTheme()
    const [imgSrc, setImgSrc] = useState<string>("");
    const imageId = images[0]?.id ?? undefined
    const displayImg = !!(imageId) && status === "ACTIVE"

    const getThumbnail = useCallback(async (imageId: string) => {
        await assetService.getPrivateThumbnail(imageId)
            .then(src => setImgSrc(src!!))
    }, []);

    useEffect(() => {
        if (displayImg) {
            getThumbnail(imageId);
        }
    }, [displayImg, imageId, getThumbnail]);

    return (
        <Stack spacing={2} py={0.5} direction="row" alignItems={"center"}>
            {displayImg ?
                <Avatar src={imgSrc} alt={"A"} sx={{backgroundColor: theme.palette.secondary.light}}/>
                :
                <Avatar sx={{backgroundColor: theme.palette.secondary.light}}>
                    <HideImageOutlinedIcon color={"disabled"}/>
                </Avatar>
            }
            <Typography fontWeight={"bold"}>{referenceName}</Typography>
        </Stack>
    )
}

const LangOptions = ({langOptions}: {
    langOptions: { lang: string }[]
}) => {
    const langs = langOptions.map(opt => opt.lang)
    return <LangList langs={langs}/>
}

const AudioOptions = ({langOptions}: {
    langOptions: { lang: string, audio?: object }[]
}) => {
    const langs = langOptions
        .filter(opt => !!opt.audio)
        .map(opt => opt.lang)
    return <LangList langs={langs}/>
}

const LangList = ({langs}: { langs: string[] }) => {
    return <AvatarGroup spacing={"small"} max={5}>
        {
            langs.map((lang, i) => {
                return (
                    <Avatar key={lang + i} sx={{width: 32, height: 32, backgroundColor: 'transparent'}}>
                        <CircleFlag countryCode={langMap.get(lang) ?? ""} height="28"/>
                    </Avatar>
                )
            })
        }
    </AvatarGroup>
}

const StatusChip = ({status}: { status: Status }) => {
    switch (status) {
        case "ACTIVE":
            return <Chip icon={<DoneIcon/>} label="Active" size="medium" variant="outlined" color="primary"/>
        case "ERROR":
            return <Chip icon={<ErrorOutlineIcon/>} label="Error" size="medium" variant="outlined" color="error"/>
        case "PROCESSING":
            return <Chip icon={<AutorenewIcon/>} label="Processing" size="medium" variant="outlined" color="primary"/>
    }
}

const RowActions = ({id, referenceName, qrCodeUrl, reload}: {
    id: string,
    referenceName: string,
    qrCodeUrl: string,
    reload: () => void
}) => {
    const navigate = useNavigate()
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const [removeExhibitDialogOpen, setRemoveExhibitDialogOpen] = useState(false);
    const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState<boolean>(false);

    const handleRemoveExhibitDialogOpen = () => setRemoveExhibitDialogOpen(true);
    const handleRemoveExhibitDialogClose = () => setRemoveExhibitDialogOpen(false);
    const handleQrCodeDialogOpen = () => setQrCodeDialogOpen(true);
    const handleQrCodeDialogClose = () => setQrCodeDialogOpen(false);

    const deleteExhibit = async (exhibitId: string) => {
        try {
            await exhibitService.deleteExhibit(exhibitId);
            reload()
            snackbar(`Exhibit id: ${exhibitId} deleted successfully.`, {variant: "success"})
        } catch (err) {
            snackbar(`Deleting exhibit id: ${exhibitId} failed.`, {variant: "error"})
        }
    }

    return (
        <>
            <ConfirmationDialog
                title={"Delete exhibits"}
                description={"Are you sure you want to permanently delete this exhibit? It will also remove all exhibits belonging to this exhibit."}
                open={removeExhibitDialogOpen}
                handleAgree={() => deleteExhibit(id)}
                handleClose={handleRemoveExhibitDialogClose}
            />
            <QrCodeDialog open={qrCodeDialogOpen} referenceName={referenceName} qrCodeUrl={qrCodeUrl} handleClose={handleQrCodeDialogClose}/>
            <Stack direction="row" display="flex" spacing={1} justifyContent="end">
                <IconButton onClick={() => handleQrCodeDialogOpen()}>
                    <QrCode2Icon/>
                </IconButton>
                <IconButton onClick={() => navigate(`/exhibits/${id}`)}>
                    <EditOutlinedIcon/>
                </IconButton>
                <IconButton onClick={() => handleRemoveExhibitDialogOpen()}>
                    <DeleteOutlinedIcon/>
                </IconButton>
            </Stack>
        </>
    )
}

const Pagination = ({page, pageSize, keys, onNextPage, onPrevPage, onPageSizeChange}: {
    page: number,
    pageSize: number,
    keys: (string | undefined)[],
    onNextPage: () => void,
    onPrevPage: () => void,
    onPageSizeChange: (pageSize: number) => void
}) => {
    return (
        <TableRow>
            <TableCell align="right" colSpan={6} sx={{paddingY: 1}}>
                <Stack direction="row" spacing={1} display="flex" justifyContent="end" alignItems={"center"}>
                    <Typography variant='subtitle2' paddingRight={1}>Rows per page:</Typography>
                    <Select
                        value={pageSize}
                        onChange={event => onPageSizeChange(+event.target.value)}
                        size={"small"}
                        sx={{
                            height: "32px",
                        }}
                    >
                        <MenuItem value={2}>
                            <Typography variant='subtitle2'>2</Typography>
                        </MenuItem>
                        <MenuItem value={5}>
                            <Typography variant='subtitle2'>5</Typography>
                        </MenuItem>
                        <MenuItem value={10}>
                            <Typography variant='subtitle2'>10</Typography>
                        </MenuItem>
                        <MenuItem value={25}>
                            <Typography variant='subtitle2'>25</Typography>
                        </MenuItem>
                    </Select>

                    <IconButton onClick={onPrevPage} disabled={page < 1}>
                        <ChevronLeftIcon/>
                    </IconButton>
                    <IconButton onClick={onNextPage} disabled={keys[page + 1] === undefined}>
                        <ChevronRightIcon/>
                    </IconButton>
                </Stack>
            </TableCell>
        </TableRow>
    )
}

const Loading = () => {
    return (
        <TableBody>
            <TableRow>
                <TableCell align="center" colSpan={6} sx={{paddingY: 8}}>
                    <CircularProgress/>
                </TableCell>
            </TableRow>
        </TableBody>
    )
}

const NoItems = () => {
    const {t} = useTranslation();
    const navigate = useNavigate()
    const theme = useTheme()

    return (
        <TableRow>
            <TableCell align="center" colSpan={6} sx={{paddingY: 8}}>
                <Typography variant='body1' fontWeight='bolder'>{t('Brak aktywnych wystaw')}</Typography>
                <Typography sx={{color: theme.palette.text.secondary, paddingBottom: 2}} variant='subtitle2'>{t('Nie posiadasz żadnego aktywnego eksponatu. Kliknij aby dodać nowy.')}</Typography>
                <Button startIcon={<AddOutlinedIcon/>} variant="outlined" onClick={() => navigate("new")}>{t('Dodaj eksponat')}</Button> </TableCell>
        </TableRow>
    )
}

export default ExhibitsPage;