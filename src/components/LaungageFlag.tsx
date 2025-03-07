import {CircleFlag} from "react-circle-flags";
import React from "react";
import {Avatar} from "@mui/material";

const countryCodeMapping: { [key: string]: string } = {
    "en-GB": 'gb',
    'pl-PL': 'pl',
    'es-ES': 'es',
}

const LanguageFlag = ({countryCode, size = 18}: { countryCode: string, size: number }) => {
    const mappedCountryCode = countryCodeMapping[countryCode] || countryCode;
    return (
        <>
            {
                mappedCountryCode
                    ? <CircleFlag countryCode={mappedCountryCode} height={size}/>
                    : <Avatar sx={{width: size, height: size}}>{countryCode}</Avatar>
            }
        </>
    )
}

export default LanguageFlag;