import { ImageRef, Status} from "./common";

export interface Exhibition {
    id: string;
    institutionId: string;
    referenceName: string;
    qrCodeUrl: string;
    includeInstitutionInfo: boolean;
    langOptions: ExhibitionLang[];
    images: ImageRef[];
    status: Status
}

export interface ExhibitionLang {
    lang: string;
    title: string;
    subtitle: string;
    article?: string
    audio?: {
        key: string,
        markup: string,
        voice: string,
    }
}

export interface CreateExhibition {
    institutionId: string,
    referenceName: string,
    langOptions: {
        lang: string;
        title: string;
        subtitle: string;
        article?: string
        audio?: {
            markup: string,
            voice: string,
        }
    }[];
    images: ImageRef[];
}