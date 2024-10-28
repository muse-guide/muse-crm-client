import {Editor, EditorContent, useEditor} from "@tiptap/react";
import React, {ChangeEvent, useCallback} from "react";
import {Box, IconButton, Stack, Typography} from "@mui/material";
import './styles.css'
import {borderColor} from "../../index";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from '@tiptap/extension-underline'
import {useTranslation} from "react-i18next";
import {CharacterCount} from "@tiptap/extension-character-count";
import StarterKit from '@tiptap/starter-kit'
import {Color} from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import ListItem from '@tiptap/extension-list-item'
import Image from '@tiptap/extension-image'

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import {Youtube} from "@tiptap/extension-youtube";
import {assetService} from "../../services/AssetService";

const limit = 5000

export const ArticleEditor = (
    {
        content,
        onContentChange,
    }: {
        content: string,
        onContentChange: (content: string) => void,
    }
) => {
    const {t} = useTranslation()

    const editor = useEditor({
        content: content,
        extensions: [
            Image,
            Youtube.configure({
                nocookie: true,
                width: 640,
                height: 480,
            }),
            Underline,
            Placeholder.configure({
                placeholder: t("dialog.article.articleEditorPlaceholder")
            }),
            CharacterCount.configure({
                limit,
            }),
            Color.configure({types: [TextStyle.name, ListItem.name]}),
            TextStyle,
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
                },
            }),
        ],
    })

    const onUpdate = useCallback(() => {
        let text = editor?.getHTML()
        console.log(text)
        onContentChange(text ?? "")
    }, [editor, onContentChange])

    editor?.on('update', onUpdate)

    return (
        <Stack gap={1}>
            <Stack position={"relative"} overflow={"hidden"} p={1} border={1} borderRadius={1} borderColor={borderColor} gap={1} minHeight={"200px"} maxHeight={"800px"}>
                <Box>
                    <ArticleEditorMenu editor={editor}/>
                </Box>
                <Box overflow={'scroll'}>
                    <EditorContent editor={editor} content={""}/>
                </Box>
            </Stack>
            <Box px={2}>
                <Typography variant={"caption"}>{`${editor?.storage.characterCount.characters()} / ${limit}`} </Typography>
            </Box>
        </Stack>
    )
}

const ArticleEditorMenu = ({editor}: { editor: Editor | null }) => {
    if (!editor) {
        return null
    }

    const addImageToEditor = async (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length < 1) return

        const image: File = input.files[0];
        const imageId = await assetService.uploadTmpFile(image)
        if (!imageId) return

        const url = await assetService.getTmpImage(imageId)
        if (!url) return

        editor.chain().focus().setImage({src: url}).run()
    }

    const addYoutubeVideo = () => {
        const url = prompt('YouTube URL')

        if (url) {
            editor.commands.setYoutubeVideo({
                src: url
            })
        }
    }

    return (
        <Stack direction={"row"} p={1} gap={2}>
            <Stack direction={"row"}>
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    color={editor.isActive('bold') ? 'primary' : 'default'}
                >
                    <FormatBoldIcon/>
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    color={editor.isActive('italic') ? 'primary' : 'default'}
                >
                    <FormatItalicIcon/>
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    disabled={!editor.can().chain().focus().toggleUnderline().run()}
                    color={editor.isActive('underline') ? 'primary' : 'default'}
                >
                    <FormatUnderlinedIcon/>
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
                    color={editor.isActive('heading', {level: 3}) ? 'primary' : 'default'}
                >
                    <FormatSizeIcon/>
                </IconButton>
            </Stack>

            <Stack direction={"row"}>
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    disabled={!editor.can().chain().focus().toggleBulletList().run()}
                    color={editor.isActive('bulletList') ? 'primary' : 'default'}
                >
                    <FormatListBulletedIcon/>
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    disabled={!editor.can().chain().focus().toggleOrderedList().run()}
                    color={editor.isActive('orderedList') ? 'primary' : 'default'}
                >
                    <FormatListNumberedIcon/>
                </IconButton>
            </Stack>

            <Stack direction={"row"}>
                <>
                    <input
                        className={'hidden'}
                        accept="image/*"
                        id="choose-file"
                        type="file"
                        onChange={(event) => addImageToEditor(event)}
                    />
                    <label htmlFor="choose-file">
                        <IconButton
                            aria-label="upload"
                            size="small"
                            component="span"
                            color={'default'}
                        >
                            <ImageOutlinedIcon/>
                        </IconButton>
                    </label>
                </>
                <IconButton
                    size="small"
                    onClick={addYoutubeVideo}
                    color={'default'}
                >
                    <OndemandVideoOutlinedIcon/>
                </IconButton>
            </Stack>
        </Stack>
    )
}