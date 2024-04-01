import {ImageRef, Status} from "./common";

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

export type CreateExhibition = Omit<Exhibition, "id" | "qrCodeUrl" | "status">

export interface ExhibitionLang {
    lang: string;
    title: string;
    subtitle: string;
    description?: string;
}