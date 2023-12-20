import {nanoid} from "nanoid";

export const nid = () => nanoid(8)

export interface Exhibition {
    id: string;
    institutionId: string;
    referenceName: string;
    qrCodeUrl: string;
    includeInstitutionInfo: boolean;
    langOptions: ExhibitionLang[];
    images: ImageRef[];
    status: "ACTIVE" | "ERROR"
}

export type CreateExhibition = Omit<Exhibition, "id" | "qrCodeUrl" | "status">

export interface ExhibitionLang {
    lang: string;
    title: string;
    subtitle: string;
    description?: string;
}

export interface ImageRef {
    key: string;
    name: string;
}
