import React, {useEffect, useState} from "react";
import {Box, Button, Checkbox, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import {PageContentContainer, PageTitle, SinglePageColumn} from "../../components/page";
import {AudioOptions, BaseTable, BaseTableRow, LangOptions, Loading, NoItems, Pagination, ResourceAvatar, RowActions, SearchTextField, StatusChip, TableHeadCell} from "../../components/table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import {Exhibit} from "../../model/exhibit";
import {useNavigate, useSearchParams} from "react-router-dom";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import {exhibitService, ExhibitsFilter} from "../../services/ExhibitService";
import {useSnackbar} from "notistack";
import {ExhibitionSelect} from "./ExhibitionSelect";
import {usePagination} from "../../components/hooks";
import {useHandleError} from "../../http/errorHandler";

const links = [{
    nameKey: "menu.exhibits",
    path: "/exhibits"
}]

const ExhibitsPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const [searchParams] = useSearchParams();
    const handleError = useHandleError();

    const [exhibits, setExhibits] = useState<Exhibit[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [filters, setFilters] = useState<ExhibitsFilter>({exhibitionId: searchParams.get("exhibitionId") || ""})
    const {page, pageSize, resetPagination, ...pagination} = usePagination();

    useEffect(() => {
        if (!filters.exhibitionId || (filters.referenceNameLike && filters.referenceNameLike.length < 3)) return
        getExhibitsAsync()
    }, [filters, page, pageSize]);

    const getExhibitsAsync = async () => {
        setLoading(true);
        try {
            const results = await exhibitService.getExhibits({
                filters: filters,
                pagination: pagination.toApiPagination(),
            })

            setExhibits(results.items as Exhibit[]);
            if (results.nextPageKey) pagination.updatePageKeys(results.nextPageKey)
        } catch (error) {
            handleError("error.updatingCustomerDetailsFailed", error);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (exhibitId: string) => {
        try {
            await exhibitService.deleteExhibit(exhibitId);
            resetPagination()
            getExhibitsAsync()
            snackbar(t("success.exhibitDeleted", {exhibitId: exhibitId}), {variant: "success"})
        } catch (error) {
            handleError("error.deletingExhibitFailed", error);
        }
    }

    const onEdit = (id: string) => navigate(`/exhibits/${id}`)

    const filterResults = (key: string, value: any) => {
        resetPagination()
        setFilters({
            ...filters,
            [key]: value
        })
    }

    const showEmptyResults = (!exhibits || exhibits.length == 0) && !!filters.exhibitionId

    return (
        <Stack width={'100%'}>
            <AppBreadcrumbs links={links}/>
            <Stack maxWidth="1024px" minWidth="540px" direction="row" display="flex" spacing={1} justifyContent="end" alignItems="center">
                <Stack direction="row" width="100%" spacing={1} flexGrow={1} justifyItems="start">
                    <PageTitle
                        title={t('page.exhibits.title')}
                        subtitle={t('page.exhibits.subtitle') as string}
                    />
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" size={"medium"} onClick={getExhibitsAsync} sx={{minWidth: "32px"}}><RefreshOutlinedIcon/></Button>
                    <Button variant="contained" size={"medium"} onClick={() => navigate(`new?exhibitionId=${filters.exhibitionId}`)} disableElevation startIcon={<AddOutlinedIcon/>}>{t("common.create")}</Button>
                </Stack>
            </Stack>
            <PageContentContainer>
                <SinglePageColumn maxWidth="1024px">
                    <Stack direction="row" spacing={1} display="flex" alignItems="center">
                        <Box width={"30%"}>
                            <ExhibitionSelect
                                value={filters.exhibitionId}
                                onChange={value => filterResults("exhibitionId", value)}
                                disabled={false}
                            />
                        </Box>
                        <Box width={"50%"}>
                            <SearchTextField
                                value={filters.referenceNameLike}
                                onChange={value => filterResults("referenceNameLike", value)}
                            />
                        </Box>
                    </Stack>

                    <BaseTable>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox"><Checkbox color="primary"/></TableCell>
                                <TableHeadCell width={"30%"}>{t("page.exhibits.table.referenceName")}</TableHeadCell>
                                <TableHeadCell align="right">{t("page.exhibits.table.number")}</TableHeadCell>
                                <TableHeadCell align="right">{t("page.exhibits.table.status")}</TableHeadCell>
                                <TableHeadCell align="right">{t("page.exhibits.table.languageOptions")}</TableHeadCell>
                                <TableHeadCell align="right">{t("page.exhibits.table.audio")}</TableHeadCell>
                                <TableHeadCell align="right">{t("page.exhibits.table.actions")}</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        {loading ? <Loading span={7}/> :
                            <TableBody>
                                {exhibits.map((row, i) => (
                                    <BaseTableRow key={row.id + i} hover>
                                        <TableCell padding="checkbox"><Checkbox color="primary"/></TableCell>
                                        <TableCell component="th" scope="row">
                                            <ResourceAvatar referenceName={row.referenceName} images={row.images} status={row.status}/>
                                        </TableCell>
                                        <TableCell align="right"><Typography variant={"body2"}>{row.number}</Typography></TableCell>
                                        <TableCell align="right"><StatusChip status={row.status}/></TableCell>
                                        <TableCell align="right"><LangOptions langOptions={row.langOptions}/></TableCell>
                                        <TableCell align="right"><AudioOptions langOptions={row.langOptions}/></TableCell>
                                        <TableCell align="right">
                                            <RowActions
                                                id={row.id}
                                                referenceName={row.referenceName}
                                                onDelete={onDelete}
                                                onEdit={onEdit}
                                                appPath={"exhibits"}
                                            />
                                        </TableCell>
                                    </BaseTableRow>
                                ))}
                                {showEmptyResults && <NoItems/>}

                                <Pagination
                                    page={page}
                                    pageSize={pageSize}
                                    keys={pagination.keys}
                                    onNextPage={pagination.nextPage}
                                    onPrevPage={pagination.prevPage}
                                    onPageSizeChange={resetPagination}
                                />
                            </TableBody>
                        }
                    </BaseTable>
                </SinglePageColumn>
            </PageContentContainer>
        </Stack>
    );
};

export default ExhibitsPage;