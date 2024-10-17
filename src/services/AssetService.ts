import {getUrl, remove, uploadData} from "aws-amplify/storage";
import {nano_8} from "../model/common";

const uploadTmpFile = async (
    file: File
) => {
    try {
        const id = nano_8()
        await uploadData({
            path: `public/tmp/images/${id}`,
            data: file
        }).result;

        return id;
    } catch (error) {
        console.log('Upload image error: ', error);
    }
};

const removeTmpImage = async (key: string) => {
    try {
        return (await remove({
            path: `public/tmp/images/${key}`,
        })).path
    } catch (error) {
        console.log('Remove image error: ', error);
    }
};

const getAsset = async (id: string, isPrivateAsset: boolean, prefix?: string) => {
    const pathPrefix = prefix ? `${prefix}/` : "";
    const key = isPrivateAsset
        ? ({identityId}: {identityId?: string | undefined}) => `private/${identityId}/${pathPrefix}${id}`
        :`public/${pathPrefix}${id}`;
    try {
        return (await getUrl({
            path: key,
            options: {
                validateObjectExistence: true,
            }
        })).url.toString()
    } catch (error) {
        console.log('Get image error: ', error);
    }
};

const getTmpImage = async (id: string) => await getAsset(id, false, "tmp/images");
const getPrivateImage = async (id: string) => await getAsset(id, true, "images");
const getPrivateThumbnail = async (id: string) => await getAsset(`${id}_thumbnail`, true, "images");
const getTmpAudio = async (id: string) => await getAsset(id, false, "tmp/audio");
const getPrivateAudio = async (id: string) => await getAsset(id, true, "audio");
const getQrCode = async (id: string) => await getAsset(id, true);

export const assetService = {
    uploadTmpFile: uploadTmpFile,
    getTmpImage: getTmpImage,
    getPrivateImage: getPrivateImage,
    getPrivateThumbnail: getPrivateThumbnail,
    removeTmpImage: removeTmpImage,
    getTmpAudio: getTmpAudio,
    getPrivateAudio: getPrivateAudio,
    getQrCode: getQrCode
};