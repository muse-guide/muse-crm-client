import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import Table, {TableProps} from '@mui/material/Table';
import TableCell, {TableCellProps} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow, {TableRowProps} from '@mui/material/TableRow';
import {BasePanel} from "./panel";
import {Avatar, AvatarGroup, Button, Chip, FormControl, IconButton, InputAdornment, MenuItem, Select, Stack, TextField, Typography, useTheme} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import ConfirmationDialog from "./dialog/ConfirmationDialog";
import QrCodeDialog from "./dialog/QrCodeDialog";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {ImageRef, langMap, Status} from "../model/common";
import {assetService} from "../services/AssetService";
import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";
import TableBody from "@mui/material/TableBody";
import CircularProgress from "@mui/material/CircularProgress";
import ClearIcon from "@mui/icons-material/Clear";
import {CircleFlag} from "react-circle-flags";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import AppDialog from "./dialog/AppDialog";
import useDialog from "./hooks";

export const BaseTable = ({children, ...props}: TableProps) => {
    return (
        <TableContainer component={BasePanel}>
            <Table sx={{minWidth: 650, width: '100%', flexGrow: 1}} size={"small"} {...props}>
                {children}
            </Table>
        </TableContainer>
    )
}

export const TableHeadCell = ({children, ...props}: TableCellProps) => {
    return (
        <TableCell sx={{paddingY: 1.5}} {...props}>
            <Typography variant="subtitle1">{children}</Typography>
        </TableCell>
    )
}

export const BaseTableRow = ({children, ...props}: TableRowProps) => {
    return (
        <TableRow
            sx={{
                border: 0,
                '&:last-child td, &:last-child th': {
                    border: 0
                }
            }}
            {...props}
        >
            {children}
        </TableRow>
    )
}
export const SearchTextField = (
    {
        value,
        onChange
    }: {
        value?: string,
        onChange: (value?: string) => void
    }
) => {
    const {t} = useTranslation();

    return (
        <FormControl size={"small"} fullWidth>
            <Typography variant='body1' pb={1}>{t("component.searchText.title")}</Typography>
            <TextField
                size="small"
                placeholder={t("component.searchText.placeholder")}
                value={value ?? ""}
                onChange={event => onChange(event.target.value)}
                InputProps={{
                    endAdornment: <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => onChange(undefined)}>
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
export const ResourceAvatar = ({referenceName, images, status}: { referenceName: string, images: ImageRef[], status: Status }) => {
    const theme = useTheme()
    const [imgSrc, setImgSrc] = useState<string>();
    const imageId = images[0]?.id ?? undefined
    const displayImg = !!(imageId) && status === "ACTIVE"

    const getThumbnail = useCallback(async (imageId: string) => {
        try {
            const response = await assetService.getAssetPreSignedUrl({assetId: `${imageId}_thumbnail`, assetType: "images"})
            setImgSrc(response.url)
        } catch (e) {
            console.error("Error fetching thumbnail: ", e)
        }
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
            <Typography sx={{fontWeight: "600"}} variant={"body2"}>{referenceName}</Typography>
        </Stack>
    )
}
export const LangOptions = ({langOptions}: {
    langOptions: { lang: string }[]
}) => {
    const langs = langOptions.map(opt => opt.lang)
    return <LangList langs={langs}/>
}
export const AudioOptions = ({langOptions}: {
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

export const StatusChip = ({status, size}: { status: Status, size?: "small" | "medium" }) => {
    const theme = useTheme()
    switch (status) {
        case "ACTIVE":
            return <Chip label="Active" size={size ?? "small"} variant="filled" sx={{backgroundColor: theme.palette.success.light}}/>
        case "ERROR":
            return <Chip label="Error" size={size ?? "small"} variant="filled" sx={{backgroundColor: theme.palette.error.light}}/>
        case "PROCESSING":
            return <Chip label="Processing" size={size ?? "small"} variant="filled" sx={{backgroundColor: theme.palette.info.light}}/>
    }
}

export const Pagination = ({page, pageSize, keys, onNextPage, onPrevPage, onPageSizeChange}: {
    page: number,
    pageSize: number,
    keys: (string | undefined)[],
    onNextPage: () => void,
    onPrevPage: () => void,
    onPageSizeChange: (pageSize: number) => void
}) => {
    return (
        <TableRow>
            <TableCell align="right" colSpan={100} sx={{paddingY: 1}}>
                <Stack direction="row" spacing={1} display="flex" justifyContent="end" alignItems={"center"}>
                    <Typography variant='subtitle1' paddingRight={1}>Rows per page:</Typography>
                    <Select
                        value={pageSize}
                        onChange={event => onPageSizeChange(+event.target.value)}
                        size={"small"}
                        sx={{
                            height: "32px",
                            alignItems: "center",
                        }}
                    >
                        <MenuItem value={2}>
                            <Typography variant='body2' lineHeight={2}>2</Typography>
                        </MenuItem>
                        <MenuItem value={5}>

                            <Typography variant='body2' lineHeight={2}>5</Typography>
                        </MenuItem>
                        <MenuItem value={10}>
                            <Typography variant='body2' lineHeight={2}>10</Typography>
                        </MenuItem>
                        <MenuItem value={25}>
                            <Typography variant='body2' lineHeight={2}>25</Typography>
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

export const RowActions = (
    {
        id,
        referenceName,
        onEdit,
        onDelete,
        appPath,
        deleteMessage = undefined

    }: {
        id: string,
        referenceName: string,
        onEdit: (id: string) => void,
        onDelete: (id: string) => Promise<void>,
        appPath: string,
        deleteMessage?: string
    }) => {
    const {t} = useTranslation()
    const [removeExhibitDialogOpen, setRemoveExhibitDialogOpen] = useState(false);
    const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState<boolean>(false);
    const appDialog = useDialog()

    const handleRemoveExhibitDialogOpen = () => setRemoveExhibitDialogOpen(true);
    const handleRemoveExhibitDialogClose = () => setRemoveExhibitDialogOpen(false);
    const handleQrCodeDialogOpen = () => setQrCodeDialogOpen(true);
    const handleQrCodeDialogClose = () => setQrCodeDialogOpen(false);

    return (
        <>
            <ConfirmationDialog
                title={t("dialog.delete.title")}
                description={deleteMessage ?? t("dialog.delete.description")}
                open={removeExhibitDialogOpen}
                handleAgree={() => onDelete(id)}
                handleClose={handleRemoveExhibitDialogClose}
            />
            <QrCodeDialog open={qrCodeDialogOpen} referenceName={referenceName} resourceId={id} handleClose={handleQrCodeDialogClose}/>
            <AppDialog
                open={appDialog.isOpen}
                path={`${appPath}/${id}`}
                handleClose={appDialog.closeDialog}
            />
            <Stack direction="row" display="flex" spacing={1} justifyContent="end">
                <IconButton onClick={() => appDialog.openDialog()}>
                    <PhoneIphoneIcon/>
                </IconButton>
                <IconButton onClick={() => handleQrCodeDialogOpen()}>
                    <QrCode2Icon/>
                </IconButton>
                <IconButton onClick={() => onEdit(id)}>
                    <EditOutlinedIcon/>
                </IconButton>
                <IconButton onClick={() => handleRemoveExhibitDialogOpen()}>
                    <DeleteOutlinedIcon/>
                </IconButton>
            </Stack>
        </>
    )
}

export const Loading = ({span}: { span: number }) => {
    return (
        <TableBody>
            <TableRow>
                <TableCell align="center" colSpan={span} sx={{paddingY: 8}}>
                    <CircularProgress/>
                </TableCell>
            </TableRow>
        </TableBody>
    )
}
export const NoItems = () => {
    const {t} = useTranslation();
    const navigate = useNavigate()
    const theme = useTheme()

    return (
        <TableRow>
            <TableCell align="center" colSpan={100} sx={{paddingY: 8}}>
                <Typography variant='body1' fontWeight='bold'>{t("page.common.noItemsTitle")}</Typography>
                <Typography sx={{color: theme.palette.text.secondary, paddingBottom: 2}} variant='subtitle1'>{t("page.common.noItemsSubtitle")}</Typography>
                <Button startIcon={<AddOutlinedIcon/>} variant="outlined" onClick={() => navigate("new")}>{t('common.create')}</Button> </TableCell>
        </TableRow>
    )
}