import React, {useEffect, useState} from "react";
import ImageUploading, {ImageListType} from "react-images-uploading";
import {Box, Button, IconButton, Link, List, ListItem, ListItemIcon, Stack, Typography, useTheme} from "@mui/material";
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {UseFieldArrayReturn} from "react-hook-form";
import {ImageRef, nid} from "../../model/common";
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import {useTranslation} from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import {ImagePreview} from "./ImagePreview";
import {getUrl, remove, uploadData} from 'aws-amplify/storage';
import {normalizeText} from "../ComponentUtils";
import LinearProgress from '@mui/material/LinearProgress';

export interface ImageHolder {
    images: ImageRef[];
}

export const ImageUploaderField = (props: { arrayMethods: UseFieldArrayReturn<ImageHolder, "images", "id"> }) => {
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    const handleClickOpen = () => {
        setUploadDialogOpen(true);
    };

    const handleClose = () => {
        setUploadDialogOpen(false);
    };

    const removeImage = async (index: number) => {
        await removeImageAsync(props.arrayMethods.fields[index].id)
        props.arrayMethods.remove(index)
    }

    return (
        <Stack pb={0} pt={1}>
            <ImageUploaderDialog arrayMethods={props.arrayMethods} open={uploadDialogOpen} handleClose={handleClose} removeImage={removeImage}/>
            <Stack direction="row" spacing={2} alignItems="center">
                <Box p={0}><Button onClick={handleClickOpen} variant="contained" disableElevation startIcon={<CloudUploadIcon/>}>Upload</Button></Box>
                <Typography variant='body1'>Dodaj zdjęcia kolekcji. Pojawią się one w aplikacji mobilnej na stronie wystawy.</Typography>
            </Stack>
            <List sx={{width: '100%', maxWidth: 500, bgcolor: 'background.paper', pb: 0, pt: 2}} dense>
                {props.arrayMethods.fields.map((field, index) => (
                    <UploadedItem key={"main-" + field.id} index={index} item={field} removeImage={removeImage}/>
                ))}
            </List>
        </Stack>
    )
}

interface ImageUploaderDialogProps {
    open: boolean,
    handleClose: () => void,
    removeImage: (index: number) => void
    arrayMethods: UseFieldArrayReturn<ImageHolder, "images", "id">
}

export function ImageUploaderDialog(props: ImageUploaderDialogProps) {
    const [uploadInProgress, setUploadInProgress] = useState(false);
    const {t} = useTranslation();
    const theme = useTheme()
    const maxNumber = 8;

    const onChange = async (imageList: ImageListType,) => {
        setUploadInProgress(true)
        const lastIndex = imageList.length - 1;
        const image = imageList[lastIndex]
        if (image.file) {
            const imageId = await uploadDataInBrowser(image.file)
            if (imageId) props.arrayMethods.append({
                id: imageId,
                name: image.file.name!!
            })
            setUploadInProgress(false)
        }
    };

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
            >
                <DialogTitle fontSize="large" fontWeight="bold" sx={{pt: 3}}>
                    Dodaj zdjęcia
                </DialogTitle>
                <DialogContent sx={{minWidth: '600px'}}>
                    <ImageUploading
                        multiple
                        // acceptType={['png']}
                        // maxFileSize={1024}
                        value={[props.arrayMethods.fields]}
                        onChange={onChange}
                        maxNumber={maxNumber}
                    >
                        {({
                              onImageUpload,
                              dragProps
                          }) => (
                            <Box width={"100%"} {...dragProps} sx={{
                                alignItems: "center",
                                height: "200px",
                                border: 1,
                                borderStyle: "dashed",
                                borderColor: theme.palette.grey[600],
                                backgroundColor: theme.palette.grey[50]
                            }}>
                                <Stack alignItems="center" spacing={0} p={3} height="100%" justifyContent="center">
                                    <Typography variant='body1' fontWeight='bolder'>Dodaj zdjęcia</Typography>
                                    <Typography sx={{color: theme.palette.text.secondary, paddingBottom: 2}} variant='subtitle2'>Przeciągnij zdjęcia tutaj albo wybierz je z dysku</Typography>
                                    <Button startIcon={<CloudUploadRoundedIcon/>} variant="outlined" onClick={onImageUpload}>Wybierz zdjęcia</Button>
                                </Stack>
                            </Box>
                        )}
                    </ImageUploading>
                    <List sx={{width: '100%', bgcolor: 'background.paper', pb: 0, pt: 2}} dense>
                        {props.arrayMethods.fields.map((field, index) => (
                            <UploadedItem key={field.id} index={index} item={field} removeImage={props.removeImage}/>
                        ))}
                        {uploadInProgress && <ListItem sx={{pl: "14px"}}>
                            <ListItem sx={{pl: 0, py: 1}}>
                                <ListItemIcon sx={{minWidth: "44px"}}>
                                    <InsertPhotoOutlinedIcon/>
                                </ListItemIcon>
                                <Box width={'100%'} px={0} mr={3}>
                                    <LinearProgress variant="indeterminate"/>
                                </Box>
                            </ListItem>
                        </ListItem>
                        }
                    </List>
                </DialogContent>
                <DialogActions sx={{px: '24px', pb: '20px'}}>
                    <Button variant="contained" disableElevation onClick={props.handleClose}>{t("common.close")}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const UploadedItem = ({index, item, removeImage}: {
    index: number,
    item: ImageRef,
    removeImage: (index: number) => void
}) => {
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [imgPrevOpen, setImgPrevOpen] = useState(false);

    useEffect(() => {
        return () => setImageUrl(undefined)
    }, [])

    const onPreview = async () => {
        if (imageUrl) {
            setImgPrevOpen(true)
            return
        }
        const url = await getImageAsync(item.id)
        setImageUrl(url)
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

const uploadDataInBrowser = async (
    file: File
) => {
    try {
        const id = nid()
        await uploadData({
            key: `images/${id}`,
            data: file,
            options: {
                accessLevel: 'private'
            }
        }).result;

        return id;
    } catch (error) {
        console.log('Upload image error: ', error);
    }
};

const getImageAsync = async (id: string) => {
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

const removeImageAsync = async (key: string) => {
    try {
        return (await remove({
            key: key,
            options: {
                accessLevel: "private"
            }
        })).key
    } catch (error) {
        console.log('Remove image error: ', error);
    }
};