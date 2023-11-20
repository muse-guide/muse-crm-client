import React from "react";
import {Avatar, AvatarGroup, Button, Stack, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import {PageContentContainer, PageTitle, SinglePageColumn} from "../../components/page";
import {BaseTable, BaseTableRow, ExhibitionRow, TableHeadCell} from "../../components/table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import {ExhibitionLang} from "../../model/Exhibition";
import {CircleFlag} from "react-circle-flags";
import {useNavigate} from "react-router-dom";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

// generate fake ExhibitionRow
const rows: ExhibitionRow[] = [
    {
        id: "1000",
        referenceName: "Galeria Sztuki Dawnej",
        langOptions: [
            {
                lang: "pl",
                title: "",
                subtitle: ""
            },
            {
                lang: "gb",
                title: "",
                subtitle: ""
            },
            {
                lang: "es",
                title: "",
                subtitle: ""
            },
        ]
    },
    {
        id: "1000",
        referenceName: "Malarstwo Młodej Polski ",
        langOptions: [
            {
                lang: "pl",
                title: "",
                subtitle: ""
            },
            {
                lang: "gb",
                title: "",
                subtitle: ""
            },
        ]
    },
];

const ExhibitionsPage = () => {
    const {t} = useTranslation();
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
                <SinglePageColumn>
                    <Stack spacing={3}>
                        <TableActions/>
                        <BaseTable>
                            <TableHead>
                                <TableRow>
                                    <TableHeadCell>Reference name</TableHeadCell>
                                    <TableHeadCell align="right">Language options</TableHeadCell>
                                    <TableHeadCell align="right">Actions</TableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <BaseTableRow key={row.id}>
                                        <TableCell component="th" scope="row">{row.referenceName}</TableCell>
                                        <TableCell align="right"><LangList langOptions={row.langOptions}/></TableCell>
                                        <TableCell align="right"><RowActions id={row.id}/></TableCell>
                                    </BaseTableRow>
                                ))}
                            </TableBody>
                        </BaseTable>
                    </Stack>
                </SinglePageColumn>
            </PageContentContainer>
        </Stack>
    );
};

const LangList = ({langOptions}: {
    langOptions: ExhibitionLang[]
}) => {
    return <AvatarGroup max={5}>
        {
            langOptions.map(opt => {
                return (
                    <Avatar sx={{width: 32, height: 32, bgcolor: "white"}}>
                        <CircleFlag alt={opt.lang} countryCode={opt.lang} height="28"/>
                    </Avatar>
                )
            })
        }
    </AvatarGroup>
}

const TableActions = () => {
    return (
        <Stack direction="row" display="flex" spacing={1} justifyContent="end">
            <Button variant="outlined"><RefreshOutlinedIcon/></Button>
            <Stack direction="row" width="100%" display="flex" flexGrow={1} justifyItems="start">
                <TextField
                    size="small"
                    placeholder="Search"
                    sx={{minWidth: "340px"}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>
            <Stack direction="row" spacing={1}>
                <Button variant="contained" disableElevation startIcon={<AddOutlinedIcon/>}>Create</Button>
            </Stack>
        </Stack>
    )
}

const RowActions = ({id}: {
    id: string
}) => {
    const navigate = useNavigate();

    return (
        <Stack direction="row" display="flex" spacing={1} justifyContent="end">
            <Button variant="text" startIcon={<DeleteOutlinedIcon/>} onClick={() => alert(`Delete me: ${id}`)}>Delete</Button>
            <Button variant="text" startIcon={<QrCode2Icon/>} onClick={() => alert(`Get code for: ${id}`)}>QR Code</Button>
            <Button variant="text" startIcon={<EditOutlinedIcon/>} onClick={() => navigate(`/exhibitions/${id}`)}>Edit</Button>
        </Stack>
    )
}

export default ExhibitionsPage;