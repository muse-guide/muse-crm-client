export interface Exhibition {
    id: string;
    institutionId: string;
    referenceName: string;
    qrCodeUrl: string;
    includeInstitutionInfo: boolean;
    langOptions: ExhibitionLang[];
    images: ImageRef[];
}

export type CreateExhibition = Omit<Exhibition, "id" | "qrCodeUrl">

export interface ExhibitionLang {
    lang: string;
    title: string;
    subtitle: string;
    description?: string;
}

export interface ImageRef {
    name: string;
    url: string;
}
