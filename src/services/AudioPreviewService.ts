import api, {getAuthHeaders, requestWrapper} from "../http/client"
import {AudioPreviewRequest, AudioPreviewResponse} from "../model/audio";

const entityPath = `/audio`;

async function generateAudioPreview(data: AudioPreviewRequest): Promise<AudioPreviewResponse> {
    return await requestWrapper(async () => {
        const response = await api.post<AudioPreviewResponse>(entityPath, data, {...await getAuthHeaders()});
        return response.data;
    })
}

export const audioService = {
    generateAudioPreview: generateAudioPreview,
};
