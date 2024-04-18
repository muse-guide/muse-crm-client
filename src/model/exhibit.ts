import {ImageRef, Status} from "./common";

export interface Exhibit {
    id: string;
    exhibitionId: string,
    referenceName: string,
    number: number,
    qrCodeUrl: string,
    langOptions: ExhibitLang[];
    images: ImageRef[];
    status: Status
}

export interface ExhibitLang {
    lang: string;
    title: string;
    subtitle: string;
    description?: string;
    audio?: {
        key: string,
        markup: string,
        voice: string,
    }
}

export interface CreateExhibit {
    exhibitionId: string,
    referenceName: string,
    number: number,
    langOptions: {
        lang: string;
        title: string;
        subtitle: string;
        description?: string;
        audio?: {
            markup: string,
            voice: string,
        }
    }[];
    images: ImageRef[];
}