import {Breadcrumbs, Link, LinkProps, Typography} from "@mui/material";
import {Link as RouterLink,} from 'react-router-dom';
import {useTranslation} from "react-i18next";

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
                Home
            </LinkRouter>
            {
                links.map((link, index) => {
                    if (index === links.length - 1) {
                        return <Typography key={index} color="text.primary">{link.nameKey}</Typography>
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