import {ImageRef, Status} from "./common";

export interface Institution {
    id: string,
    referenceName: string,
    langOptions: InstitutionLang[],
    images: ImageRef[],
    status: Status
}

export interface InstitutionLang {
    lang: string;
    title: string;
    subtitle?: string;
    article?: string
    audio?: {
        key: string,
        markup: string,
        voice: string,
    }
}

export interface CreateInstitution {
    referenceName: string,
    langOptions: {
        lang: string;
        title: string;
        subtitle?: string;
        article?: string
        audio?: {
            markup: string,
            voice: string,
        }
    }[];
    images: ImageRef[];
}