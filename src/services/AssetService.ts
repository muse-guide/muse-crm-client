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

const getTmpImageAsync = async (id: string) => {
    try {
        return (await getUrl({
            key: `tmp/images/${id}`,
            options: {
                accessLevel: "guest",
                validateObjectExistence: true,
            }
        })).url.toString()
    } catch (error) {
        console.log('Get image error: ', error);
    }
};

const getPrivateImageAsync = async (id: string) => {
    try {
        return (await getUrl({
            key: `images/${id}`,
            options: {
                accessLevel: "private",
                validateObjectExistence: true,
            }
        })).url.toString()
    } catch (error) {
        console.log('Get image error: ', error);
    }
};

const getPrivateThumbnailAsync = async (id: string) => {
    try {
        return (await getUrl({
            key: `images/${id}_thumbnail`,
            options: {
                accessLevel: "private",
                validateObjectExistence: true,
            }
        })).url.toString()
    } catch (error) {
        console.log('Get image error: ', error);
    }
};

const getTmpAudioAsync = async (id: string) => {
    try {
        return (await getUrl({
            key: `tmp/audio/${id}`,
            options: {
                accessLevel: "guest",
                validateObjectExistence: true,
            }
        })).url.toString()
    } catch (error) {
        console.log('Get image error: ', error);
    }
};

const getPrivateAudioAsync = async (id: string) => {
    try {
        return (await getUrl({
            key: `audio/${id}`,
            options: {
                accessLevel: "private",
                validateObjectExistence: true,
            }
        })).url.toString()
    } catch (error) {
        console.log('Get image error: ', error);
    }
};

const removeTmpImageAsync = async (key: string) => {
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

export const assetService = {
    uploadTmpFile: uploadTmpFile,
    getTmpImageAsync: getTmpImageAsync,
    getPrivateImageAsync: getPrivateImageAsync,
    getPrivateThumbnailAsync: getPrivateThumbnailAsync,
    removeTmpImageAsync: removeTmpImageAsync,
    getTmpAudioAsync: getTmpAudioAsync,
    getPrivateAudioAsync: getPrivateAudioAsync
};