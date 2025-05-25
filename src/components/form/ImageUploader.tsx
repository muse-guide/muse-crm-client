import React, {ChangeEvent, useEffect, useState} from "react";
import {Box, Button, IconButton, Link, List, ListItem, ListItemIcon, Stack, Typography} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {UseFieldArrayReturn} from "react-hook-form";
import {ImageRef} from "../../model/common";
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import {useTranslation} from "react-i18next";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import {ImagePreview} from "./ImagePreview";
import {normalizeText} from "../ComponentUtils";
import LinearProgress from '@mui/material/LinearProgress';
import {assetService} from "../../services/AssetService";
import {useSnackbar} from "notistack";

export interface ImageHolder {
    images: ImageRef[];
}

export const ImageUploaderField = (props: { arrayMethods: UseFieldArrayReturn<ImageHolder, "images", "id"> }) => {
    const [uploadInProgress, setUploadInProgress] = useState(false);
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();

    const removeImage = async (index: number) => {
        props.arrayMethods.remove(index)
    }

    const addImage = async (event: ChangeEvent<HTMLInputElement>) => {
        setUploadInProgress(true);

        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length < 1) return;

        const image: File = input.files[0];

        // Validate image size (max 2MB)
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        if (image.size > maxSizeInBytes) {
            setUploadInProgress(false);
            snackbar(t("The selected image exceeds the maximum size of 2MB."), {variant: "error"})
            return;
        }

        const imageId = await assetService.uploadTmpFile(image);
        if (!imageId) return;

        props.arrayMethods.append({
            id: imageId,
            name: image.name,
            tmp: true,
        });

        input.value = '';
        setUploadInProgress(false);
    };

    return (
        <Stack pb={0} pt={1}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Box p={0}>
                    <input
                        hidden
                        accept="image/*"
                        id="choose-resource-images"
                        type="file"
                        onChange={addImage}
                    />
                    <label htmlFor="choose-resource-images">
                        <Button component="span" variant="contained" disableElevation startIcon={<CloudUploadIcon/>}>
                            {t("common.upload")}
                        </Button>
                    </label>
                </Box>
                <Typography variant='body1'>{t("dialog.uploadPhoto.uploadHelperText")}</Typography>
            </Stack>
            <List sx={{width: '100%', maxWidth: 500, pb: 0, pt: 2}} dense>
                {props.arrayMethods.fields.map((field, index) => (
                    <UploadedItem key={"main-" + field.id} index={index} item={field} removeImage={removeImage} tmp={field.tmp}/>
                ))}
                {uploadInProgress && <ListItem sx={{pl: "14px", py: 1}}>
                    <ListItemIcon sx={{minWidth: "44px"}}>
                        <InsertPhotoOutlinedIcon/>
                    </ListItemIcon>
                    <Box width={'100%'} px={0} mr={2}>
                        <LinearProgress variant="indeterminate"/>
                    </Box>
                </ListItem>
                }
            </List>
        </Stack>
    )
}

const UploadedItem = ({index, item, removeImage, tmp}: {
    index: number,
    item: ImageRef,
    removeImage: (index: number) => void,
    tmp?: boolean
}) => {
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [imgPrevOpen, setImgPrevOpen] = useState(false);

    useEffect(() => {
        return () => setImageUrl(undefined)
    }, [])

    const getImageAsync = async (id: string, tmp?: boolean) => {
        try {
            if (tmp) return await assetService.getAssetPreSignedUrl({assetId: id, assetType: "tmp"})
            else return await assetService.getAssetPreSignedUrl({assetId: id, assetType: "images"})
        } catch (error) {
            console.error('Get image error: ', error);
        }
    };

    const onPreview = async () => {
        if (imageUrl) {
            setImgPrevOpen(true)
            return
        }
        const response = await getImageAsync(item.id, tmp)
        setImageUrl(response?.url)
        setImgPrevOpen(true)
    }

    return (
        <>
            <ImagePreview show={imgPrevOpen} close={() => setImgPrevOpen(false)} img={imageUrl}/>
            <ListItem sx={{pl: "14px"}}>
                <ListItemIcon sx={{minWidth: "44px"}}>
                    <InsertPhotoOutlinedIcon/>
                </ListItemIcon>
                <Link
                    key={`images/${item.id}`}
                    underline="always"
                    variant="body1"
                    width="100%"
                    display="flex"
                    justifyItems="start"
                    onClick={onPreview}
                >
                    {normalizeText(36, item.name)}
                </Link>
                <IconButton onClick={() => removeImage(index)}>
                    <DeleteForeverOutlinedIcon/>
                </IconButton>
            </ListItem>
        </>
    )
}