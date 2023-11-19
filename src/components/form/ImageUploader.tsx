import React, {useState} from "react";
import ImageUploading, {ImageListType} from "react-images-uploading";
import {Box, Button, IconButton, Link, List, ListItem, ListItemIcon, Stack, Typography, useTheme} from "@mui/material";
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {UseFieldArrayReturn} from "react-hook-form";
import {Exhibition} from "../../model/Exhibition";
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import {useTranslation} from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import {ImagePreview} from "./ImagePreview";

export const ImageUploaderField = (props: { arrayMethods: UseFieldArrayReturn<Exhibition, "images", "id"> }) => {
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [imgPrevOpen, setImgPrevOpen] = useState(false);
    const [imgPrevUrl, setImgPrevUrl] = useState("");

    const handleClickOpen = () => {
        setUploadDialogOpen(true);
    };

    const handleClose = () => {
        setUploadDialogOpen(false);
    };

    const removeImage = (index: number) => {
        props.arrayMethods.remove(index)
    }

    const onPreview = (url: string) => {
        setImgPrevUrl(url)
        setImgPrevOpen(true)
    }

    return (
        <Stack pb={0} pt={1}>
            <ImageUploaderDialog arrayMethods={props.arrayMethods} open={uploadDialogOpen} handleClose={handleClose}/>
            <Stack direction="row" spacing={2} alignItems="center">
                <Box p={0}><Button onClick={handleClickOpen} variant="contained" startIcon={<CloudUploadIcon/>}>Upload</Button></Box>
                <Typography variant='body2'>Dodaj zdjęcia kolekcji. Pojawią się one w aplikacji mobilnej na stronie wystawy.</Typography>
            </Stack>
            <ImagePreview show={imgPrevOpen} close={() => setImgPrevOpen(false)} img={imgPrevUrl} />
            <List sx={{width: '100%', maxWidth: 500, bgcolor: 'background.paper', pb: 0, pt: 2}} dense>
                {props.arrayMethods.fields.map((field, index) => (
                    <ListItem key={field.id} sx={{pl: "14px"}}>
                        <ListItemIcon sx={{minWidth: "44px"}}>
                            <InsertPhotoOutlinedIcon/>
                        </ListItemIcon>
                        <Link
                            component="button"
                            type="button"
                            variant="body2"
                            width="100%"
                            display="flex"
                            justifyItems="start"
                            onClick={() => onPreview(field.url)}
                        >
                            {field.name}
                        </Link>
                        <IconButton onClick={() => removeImage(index)}>
                            <DeleteForeverOutlinedIcon/>
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    )
}

interface ImageUploaderDialogProps {
    open: boolean,
    handleClose: () => void,
    arrayMethods: UseFieldArrayReturn<Exhibition, "images", "id">
}

export function ImageUploaderDialog(props: ImageUploaderDialogProps) {
    const {t} = useTranslation();
    const theme = useTheme()
    const [imgPrevOpen, setImgPrevOpen] = useState(false);
    const [imgPrevUrl, setImgPrevUrl] = useState("");
    const maxNumber = 8;

    const onChange = (
        imageList: ImageListType,
    ) => {
        const lastIndex = imageList.length - 1;
        props.arrayMethods.append( {
            name: imageList[lastIndex].file?.name ?? "no",
            url: imageList[lastIndex].dataURL!!
        })
    };

    const removeImage = (index: number) => {
        props.arrayMethods.remove(index)
    }

    const onPreview = (url: string) => {
        setImgPrevUrl(url)
        setImgPrevOpen(true)
    }

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
                        value={[props.arrayMethods.fields]}
                        onChange={onChange}
                        maxNumber={maxNumber}
                    >
                        {({
                              imageList,
                              onImageUpload,
                              onImageRemove,
                              isDragging,
                              dragProps
                          }) => (
                            <Stack>
                                <Box width={"100%"} {...dragProps} sx={{
                                    alignItems: "center",
                                    height: "200px",
                                    border: 1,
                                    borderStyle: "dashed",
                                    borderColor: theme.palette.grey[600],
                                    backgroundColor: theme.palette.grey[50]
                                }}>
                                    <Stack alignItems="center" spacing={0} p={3} height="100%" justifyContent="center">
                                        <Typography variant='body2' fontWeight='bolder'>Dodaj zdjęcia wystawy</Typography>
                                        <Typography sx={{color: theme.palette.text.secondary, paddingBottom: 2}} variant='subtitle2'>Przeciągnij zdjęcia tutaj albo wybierz je z dysku</Typography>
                                        <Button startIcon={<CloudUploadRoundedIcon/>} variant="outlined" onClick={onImageUpload}>Wybierz zdjęcia</Button>
                                    </Stack>
                                </Box>
                            </Stack>
                        )}
                    </ImageUploading>
                    <ImagePreview show={imgPrevOpen} close={() => setImgPrevOpen(false)} img={imgPrevUrl} />
                    <List sx={{width: '100%', bgcolor: 'background.paper', pb: 0, pt: 2}} dense>
                        {props.arrayMethods.fields.map((field, index) => (
                            <ListItem key={field.id} sx={{pl: 0}}>
                                <ListItemIcon sx={{pr: 2}}>
                                    <img src={field.url} alt="" style={{objectFit: "contain", height: 60, width: 80}}/>
                                </ListItemIcon>
                                <Link
                                    component="button"
                                    variant="body2"
                                    width="100%"
                                    display="flex"
                                    justifyItems="start"
                                    onClick={() => onPreview(field.url)}
                                >
                                    {field.name}
                                </Link>
                                <IconButton onClick={() => removeImage(index)}>
                                    <DeleteForeverOutlinedIcon/>
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{px: '24px', pb: '20px'}}>
                    <Button variant="contained" disableElevation onClick={props.handleClose}>{t("common.close")}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}