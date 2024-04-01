export interface AudioPreviewRequest {
    markup: string,
    voice: string,
    lang: string,
}

export interface AudioPreviewResponse {
    audio: {
        key: string,
    }
}