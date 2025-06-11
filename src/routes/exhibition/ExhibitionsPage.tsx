import React, {useEffect, useState} from "react";
import {Box, Button, Checkbox, Stack} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../../components/Breadcrumbs";
import {PageContentContainer, PageTitle, SinglePageColumn} from "../../components/page";
import {AudioOptions, BaseTable, BaseTableRow, LangOptions, Loading, NoItems, Pagination, ResourceAvatar, RowActions, SearchTextField, StatusChip, TableHeadCell} from "../../components/table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import {Exhibition} from "../../model/exhibition";
import {useNavigate} from "react-router-dom";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import {exhibitionService, ExhibitionsFilter} from "../../services/ExhibitionService";
import {useSnackbar} from "notistack";
import {usePagination} from "../../components/hooks";
import {useHandleError} from "../../http/errorHandler";

const links = [{
    nameKey: "menu.exhibitions",
    path: "/exhibitions"
}]

const ExhibitionsPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {enqueueSnackbar: snackbar} = useSnackbar();
    const handleError = useHandleError();

    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [filters, setFilters] = useState<ExhibitionsFilter>({referenceNameLike: undefined})
    const {page, pageSize, resetPagination, ...pagination} = usePagination();

    useEffect(() => {
        getExhibitionsAsync()
    }, [filters, page, pageSize]);

    const getExhibitionsAsync = async () => {
        setLoading(true);
        try {
            const results = await exhibitionService.getExhibitions({
                filters: filters,
                pagination: pagination.toApiPagination()
            });

            setExhibitions(results.items as Exhibition[])
            if (results.nextPageKey) pagination.updatePageKeys(results.nextPageKey)
        } catch (error) {
            handleError("error.fetchingExhibitionsFailed", error);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (exhibitionId: string) => {
        try {
            await exhibitionService.deleteExhibition(exhibitionId);
            resetPagination()
            getExhibitionsAsync()
            snackbar(t("success.exhibitionDeleted", {exhibitionId: exhibitionId}), {variant: "success"})
        } catch (error) {
            handleError("error.deletingExhibitionFailed", error);
        }
    }

    const onEdit = (id: string) => navigate(`/exhibitions/${id}`)

    const filterResults = (key: string, value: any) => {
        resetPagination()
        setFilters({
            ...filters,
            [key]: value
        })
    }

    const showEmptyResults = !exhibitions || exhibitions.length === 0

    return (
        <Stack width={'100%'}>
            <AppBreadcrumbs links={links}/>
            <Stack maxWidth="1024px" minWidth="540px" direction="row" display="flex" spacing={1} justifyContent="end" alignItems="center">
                <Stack direction="row" width="100%" spacing={1} flexGrow={1} justifyItems="start">
                    <PageTitle
                        title={t('page.exhibitions.title')}
                        subtitle={t('page.exhibitions.subtitle') as string}
                    />
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" size={"medium"} onClick={getExhibitionsAsync} sx={{minWidth: "32px"}}><RefreshOutlinedIcon/></Button>
                    <Button variant="contained" size={"medium"} onClick={() => navigate("new")} disableElevation startIcon={<AddOutlinedIcon/>}>{t("common.create")}</Button>
                </Stack>
            </Stack>
            <PageContentContainer>
                <SinglePageColumn maxWidth="1024px">
                    <Stack direction="row" spacing={1} display="flex" alignItems="center">
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
                                <TableHeadCell width={"30%"}>{t("page.exhibitions.table.referenceName")}</TableHeadCell>
                                <TableHeadCell align="right">{t("page.exhibitions.table.status")}</TableHeadCell>
                                <TableHeadCell align="right">{t("page.exhibitions.table.languageOptions")}</TableHeadCell>
                                <TableHeadCell align="right">{t("page.exhibitions.table.audio")}</TableHeadCell>
                                <TableHeadCell align="right">{t("page.exhibitions.table.actions")}</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        {loading ? <Loading span={6}/> :
                            <TableBody>
                                {exhibitions.map((row, i) => (
                                    <BaseTableRow key={row.id + i}>
                                        <TableCell padding="checkbox"><Checkbox color="primary"/></TableCell>
                                        <TableCell component="th" scope="row">
                                            <ResourceAvatar referenceName={row.referenceName} images={row.images} status={row.status}/>
                                        </TableCell>
                                        <TableCell align="right"><StatusChip status={row.status}/></TableCell>
                                        <TableCell align="right"><LangOptions langOptions={row.langOptions}/></TableCell>
                                        <TableCell align="right"><AudioOptions langOptions={row.langOptions}/></TableCell>
                                        <TableCell align="right">
                                            <RowActions
                                                id={row.id}
                                                referenceName={row.referenceName}
                                                onDelete={onDelete}
                                                onEdit={onEdit}
                                                appPath={"exhibitions"}
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
    )
        ;
};

export default ExhibitionsPage;