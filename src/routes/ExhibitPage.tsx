import React from "react";
import {Stack} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AppBreadcrumbs} from "../components/Breadcrumbs";
import {PageTitle} from "../components/page";

const ExhibitPage = () => {
    const {t} = useTranslation();
    const links = [
        {
            nameKey: "menu.exhibits",
            path: "/exhibits"
        },
        {
            nameKey: "Mona Lisa",
            path: ""
        },
    ]

    return (
        <Stack width={"60%"}
               justifyContent={"initial"}
        >
            <AppBreadcrumbs links={links}/>
            <PageTitle title={t('exhibitPage.title')} subtitle={t('exhibitPage.subtitle') as string}/>
        </Stack>
    );
};

export default ExhibitPage;
