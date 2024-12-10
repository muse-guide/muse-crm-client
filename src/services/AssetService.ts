import {AssetType, nano_16} from "../model/common";
import api, {getAuthHeaders, requestWrapper} from "../http/client";

const entityPath = `/assets`;

const uploadTmpFile = async (
    file: File
) => {
    try {
        const request = {
            assetId: nano_16(),
            contentType: file.type
        }
        const {url} = await generatePreSignedUrlForPut(request)

        return await requestWrapper(async () => {
            const response = await api.put(url, file, {
                headers: {
                    'Content-Type': file.type,
                }
            });
            return request.assetId;
        })

    } catch (error) {
        console.log('Upload image error: ', error);
    }
};

type PreSignedUrlResponse = {
    url: string,
}

const generatePreSignedUrlForPut = async (data: { assetId: string, contentType: string }): Promise<PreSignedUrlResponse> => {
    return await requestWrapper(async () => {
        const path = `${entityPath}/put-presigned-url`;
        const response = await api.post<PreSignedUrlResponse>(path, data, {...await getAuthHeaders()});
        return response.data;
    })
}

const getAssetPreSignedUrl = async (data: { assetId: string, assetType: AssetType }): Promise<PreSignedUrlResponse> => {
    return await requestWrapper(async () => {
        const path = `${entityPath}/get-presigned-url`;
        const response = await api.post<PreSignedUrlResponse>(path, data, {...await getAuthHeaders()});
        return response.data;
    })
}

export const assetService = {
    uploadTmpFile: uploadTmpFile,
    getAssetPreSignedUrl: getAssetPreSignedUrl,
};