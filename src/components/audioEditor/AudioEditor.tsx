import {Editor, EditorContent, useEditor} from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import React, {useCallback, useEffect, useState} from "react";
import {Box, Chip, Popover, Stack, Typography} from "@mui/material";
import './styles.css'
import {borderColor} from "../../index";
import Placeholder from "@tiptap/extension-placeholder";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {useTranslation} from "react-i18next";
import {CharacterCount} from "@tiptap/extension-character-count";

const limit = 2000

const availableSsmlTags =[
    /<break\/>/g,
    /<break time="[^"]+"\/>/g,
    /<lang xml:lang="[^"]+">/g,
    /<\/lang>/g,
]

const characterCounter = (characters: string) => {
    let cleanedCharacters = characters.slice();
    for (const tags in availableSsmlTags) {
        cleanedCharacters = cleanedCharacters.replaceAll(availableSsmlTags[tags], '');
    }
    return cleanedCharacters.length;
}

export const AudioEditor = (
    {
        content,
        onContentChange
    }: {
        content: string,
        onContentChange: (content: string) => void
    }
) => {
    const {t} = useTranslation()
    const contentSanitized = content
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')

    const editor = useEditor({
        content: contentSanitized,
        extensions: [
            Paragraph,
            Document,
            Text,
            Placeholder.configure({
                placeholder: t("dialog.audio.audioEditorPlaceholder")
            }),
            CharacterCount.configure({
                textCounter: characterCounter,
                limit,
            }),
        ],
    })

    const onUpdate = useCallback(() => {
        let text = editor?.getText()
        .replaceAll('&lt;', "<")
        .replaceAll('&gt;', ">")

        onContentChange(text ?? "")
    }, [editor, onContentChange])

    editor?.on('update', onUpdate)

    return (
        <Stack position={"relative"} p={1} border={1} borderRadius={1} borderColor={borderColor} gap={0} minHeight={"200px"}>
            <AudioEditorMenu editor={editor}/>
            <EditorContent editor={editor} content={"p"}/>
            <Box position={"absolute"} p={1} bottom={-35}>
                <Typography variant={"caption"}>{`${editor?.storage.characterCount.characters()} / ${limit}`} </Typography>
            </Box>
        </Stack>
    )
}

const AudioEditorMenu = ({editor}: { editor: Editor | null }) => {
    const {t} = useTranslation()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [popoverContent, setPopoverContent] = useState<string | null>(null);

    if (!editor) {
        return null
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, popoverContent: string) => {
        setPopoverContent(popoverContent)
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'say-as-popover' : undefined;

    return (
        <Stack direction={"row"} p={1} gap={1}>
            <Chip
                label={t("dialog.audio.sayIn")}
                variant={"filled"}
                onClick={() => editor.chain().focus().insertContent('<lang xml:lang="en-GB">How are you?</lang>').run()}
                onDelete={(event: React.MouseEvent<HTMLButtonElement>) => handleClick(event, t("dialog.audio.sayInHelperText"))}
                deleteIcon={<InfoOutlinedIcon fontSize={"small"}/>}
            />
            <Chip
                label={t("dialog.audio.longPause")}
                variant={"filled"}
                onClick={() => editor.chain().focus().insertContent('<break/>').run()}
                onDelete={(event: React.MouseEvent<HTMLButtonElement>) => handleClick(event, t("dialog.audio.longPauseHelperText"))}
                deleteIcon={<InfoOutlinedIcon fontSize={"small"}/>}
            />
            <Chip
                label={t("dialog.audio.customPause")}
                variant={"filled"}
                onClick={() => editor.chain().focus().insertContent('<break time="1s"/>').run()}
                onDelete={(event: React.MouseEvent<HTMLButtonElement>) => handleClick(event, t("dialog.audio.customPauseHelperText"))}
                deleteIcon={<InfoOutlinedIcon fontSize={"small"}/>}
            />
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                sx={{
                    maxWidth: "1000px",
                    flexWrap: "wrap"
                }}
            >
                <Typography sx={{p: 2}}>{popoverContent}</Typography>
            </Popover>
        </Stack>
    )
}