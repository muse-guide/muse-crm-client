import {getUrl, remove, uploadData} from "aws-amplify/storage";
import {nano_8} from "../model/common";

const uploadTmpFile = async (
    file: File
) => {
    try {
        const id = nano_8()
        await uploadData({
            key: `tmp/images/${id}`,
            data: file,
            options: {
                accessLevel: 'guest'
            }
        }).result;

        return id;
    } catch (error) {
        console.log('Upload image error: ', error);
    }
};

const removeTmpImage = async (key: string) => {
    try {
        return (await remove({
            key: `tmp/images/${key}`,
            options: {
                accessLevel: "guest"
            }
        })).key
    } catch (error) {
        console.log('Remove image error: ', error);
    }
};

const getAsset = async (id: string, level: "guest" | "private", prefix?: string) => {
    const key = prefix ? `${prefix}/${id}` : id;
    try {
        return (await getUrl({
            key: key,
            options: {
                accessLevel: level,
                validateObjectExistence: true,
            }
        })).url.toString()
    } catch (error) {
        console.log('Get image error: ', error);
    }
};

const getTmpImage = async (id: string) => await getAsset(id, "guest", "tmp/images");
const getPrivateImage = async (id: string) => await getAsset(id, "private", "images");
const getPrivateThumbnail = async (id: string) => await getAsset(`${id}_thumbnail`, "private", "images");
const getTmpAudio = async (id: string) => await getAsset(id, "guest", "tmp/audio");
const getPrivateAudio = async (id: string) => await getAsset(id, "private", "audio");
const getQrCode = async (id: string) => await getAsset(id, "private");

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