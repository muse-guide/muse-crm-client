import {Box, Breadcrumbs, Link, LinkProps, Typography} from "@mui/material";
import {Link as RouterLink,} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

interface BreadcrumbsLink {
    nameKey: string,
    path: string
}

interface LinkRouterProps extends LinkProps {
    to: string;
}

function LinkRouter(props: LinkRouterProps) {
    return <Link underline="hover" color='inherit' {...props} component={RouterLink as any}/>;
}

export const AppBreadcrumbs = ({links}: { links: BreadcrumbsLink[] }) => {
    const {t} = useTranslation();

    return (
        <Breadcrumbs aria-label="breadcrumb">
            <LinkRouter to={'/'}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                    <HomeOutlinedIcon fontSize={"small"}/>
                </Box>
            </LinkRouter>
            {
                links.map((link, index) => {
                    if (index === links.length - 1) {
                        return <Typography key={index} color="text.primary">{t(link.nameKey)}</Typography>
                    }
                    return (
                        <LinkRouter key={index} to={link.path}>
                            {t(link.nameKey)}
                        </LinkRouter>
                    )
                })
            }
        </Breadcrumbs>
    )
}