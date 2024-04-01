import {Box, Stack, Typography} from "@mui/material";
import React, {useMemo, useRef} from "react";
import {Control, Controller, ControllerProps} from "react-hook-form";
import {useTranslation} from "react-i18next";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import "./styles.css";
import Quill from "quill";
import {borderColor} from "../../index";

interface TextInputCustomProps {
    name: string;
    title: string,
    control?: Control<any>;
    customValidation?: ControllerProps['rules'];
    maxLength?: number;

}

const Delta = Quill.import('delta')

const TextEditor = ({
                        name,
                        title,
                        control,
                        customValidation = {},
                        maxLength = undefined,
                    }: TextInputCustomProps) => {
    const {t} = useTranslation();

    if (maxLength) {
        customValidation.maxLength = {
            value: maxLength,
            message: t("validation.maxLength", {length: maxLength})
        };
    }

    const qRef = useRef<ReactQuill>(null);
    const imageInput = useRef<HTMLInputElement>(null);

    // uses memo to avoid creating the object on every keypress and triggering a render
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                ["bold", "italic", "underline"], ["link"],
                [{list: "ordered"}, {list: "bullet"}],
                ["image"]
            ],
            handlers: {
                'image': () => {
                    imageInput.current?.click()
                }
            }
        }
    }), [])

    const uploadImage = async () => {
        const file = imageInput.current?.files?.[0];

        // Upload here and populate link
        const link = `/asset/exhibitions/1000/image/img1-small.jpg`

        const editor = qRef.current?.getEditor()
        let index = editor?.getSelection()?.index ?? 0

        const imageDelta = new Delta([
            {retain: index},
            {insert: '\n\n'},
            {
                insert: {image: link},
                attributes: {
                    alt: "not found",
                    width: "50%"
                }
            },
            {insert: '\n\n'}
        ])
        editor?.updateContents(imageDelta, 'user')
    }

    return (
        <Controller
            name={name}
            control={control}
            rules={customValidation}
            render={({
                         field: {value, onChange, onBlur},
                     }) => (
                <Stack>
                    <Typography variant='body1' pb={2}>{title}</Typography>
                    <Box border={1} borderRadius={1} borderColor={borderColor}>
                        <ReactQuill
                            ref={qRef}
                            theme="snow"
                            placeholder="Opis wystawy"
                            modules={modules}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                        />
                    </Box>
                    <input ref={imageInput} type="file" accept="image/*" hidden={true} onChange={uploadImage}/>
                </Stack>
            )}
        />
    )
}

export default TextEditor