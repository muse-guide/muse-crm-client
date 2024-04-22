import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, MenuItem, Stack, TextField} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {CircleFlag} from "react-circle-flags";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DialogActions from "@mui/material/DialogActions";
import SaveIcon from "@mui/icons-material/Save";
import {langMap} from "../../model/common";
import PauseIcon from '@mui/icons-material/Pause';
import LoadingButton from "@mui/lab/LoadingButton";
import StopIcon from '@mui/icons-material/Stop';
import {AudioPreviewRequest} from "../../model/audio";
import {audioService} from "../../services/AudioPreviewService";
import {assetService} from "../../services/AssetService";
import {useSnackbar} from "notistack";

const MAX_LENGTH = 1000;

export const AudioGeneratorDialog = (props: {
    input: {
        markup: string | undefined,
        voice: string | undefined,
        key: string | undefined,
        lang: string,
    }
    open: boolean,
    handleClose: () => any | Promise<any>
    handleSave: (markup: string | undefined, voice: string | undefined) => any | Promise<any>
}) => {
    const [markup, setMarkup] = useState("");
    const [voice, setVoice] = useState("FEMALE_1");
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>();
    const {t} = useTranslation();
    const {enqueueSnackbar: snackbar} = useSnackbar();

    const setDefaults = useCallback(() => {
        setError(undefined)
        setMarkup(props.input.markup ?? "")
        setVoice(props.input.voice ?? "FEMALE_1")
        setAudioUrl(undefined)
        setLoading(false)
        setPlaying(false)
    }, [props.input.markup, props.input.voice]);

    useEffect(() => {
        setDefaults()
        return () => {
            audio.removeEventListener('ended', setPlayingFalse)
        }
    }, [setDefaults])

    useEffect(() => {
        if (!playing) {
            audio.pause()
        } else {
            audio.play()
        }
    }, [playing])

    const setPlayingFalse = useCallback(() => {
        setPlaying(false)
    }, []);

    const onClose = () => {
        props.handleClose()
        audio.pause()
        setDefaults()
    }

    const audio = useMemo(
        () => new Audio(audioUrl),
        [audioUrl]
    )

    audio.addEventListener('ended', setPlayingFalse)

    const handleMarkupChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setError(undefined)
        if (event.target.value.length > MAX_LENGTH) {
            setError(t("validation.maxLength", {length: MAX_LENGTH}))
        }
        setMarkup(event.target.value)
        setAudioUrl(undefined)
    }

    const handleSaveAudio = useCallback(() => {
        if (!markup || markup.length === 0) {
            props.handleSave(undefined, undefined)
            return
        }
        props.handleSave(markup, voice)
    }, [markup, voice, props]);

    const clickAudioButton = useCallback(async () => {
        if (audioUrl) {
            if (playing) setPlaying(false)
            else setPlaying(true)
        } else {
            if (props.input.key && props.input.markup === markup) {
                try {
                    setLoading(true)
                    const url = await assetService.getPrivateAudio(props.input.key)
                    setAudioUrl(url)
                    setPlaying(true)
                } catch (e) {
                    snackbar(t("error.audioGeneration"), {variant: "error"})
                } finally {
                    setLoading(false)
                }

            } else {
                try {
                    setLoading(true)
                    const url = await generateAudioAsync({
                        markup: markup,
                        voice: voice,
                        lang: props.input.lang,
                    })
                    setAudioUrl(url)
                    setPlaying(true)
                } catch (e) {
                    snackbar(t("error.audioGeneration"), {variant: "error"})
                } finally {
                    setLoading(false)
                }
            }
        }
    }, [audioUrl, playing, props.input.key, props.input.markup, markup, voice, props.input.lang]);

    const clickReplayAudioButton = useCallback(async () => {
        if (audioUrl) {
            setPlaying(false)
            audio.currentTime = 0;
            setPlaying(true)
        }
    }, [audioUrl]);

    const AudioButtonIcon = () => {
        if (playing) {
            return (
                <Button onClick={clickAudioButton} startIcon={<PauseIcon/>} variant="contained" disableElevation>
                    {t("pause")}
                </Button>)
        }

        return (
            <LoadingButton
                variant="contained"
                disableElevation
                loading={loading}
                loadingPosition="start"
                startIcon={<PlayArrowIcon/>}
                onClick={clickAudioButton}
            >
                {audioUrl ? t("listen") : t("try it")}
            </LoadingButton>
        )
    }

    const ReplayAudioButton = () => {
        if (audioUrl) {
            return (
                <Button onClick={clickReplayAudioButton} startIcon={<StopIcon/>} variant="outlined" disableElevation>
                    {t('replay')}
                </Button>
            )
        }
    }

    return (
        <Dialog
            maxWidth={"md"}
            open={props.open}
            onClose={onClose}
        >
            <DialogTitle fontSize="large" fontWeight="bold" sx={{pt: 3}}>
                <Stack pb={1} direction={"row"} alignItems={"center"} gap={1}>
                    <AutoAwesomeIcon/>
                    {t("dialog.audio.title")}
                </Stack>
            </DialogTitle>
            <DialogContent dividers={false}>
                <DialogContentText>
                    {t("dialog.audio.description")}
                </DialogContentText>
                <Stack pt={4}>
                    <Stack direction={"row"} display="flex" flexDirection={"row"} spacing={1} justifyContent="end">
                        <Stack direction="row" gap={2} flexGrow={1} justifyItems="start" alignItems={"center"}>
                            <CircleFlag countryCode={langMap.get(props.input.lang) ?? ""} height="32"/>
                            <VoiceSelect voice={voice} setVoice={setVoice}/>
                        </Stack>
                        <Stack direction="row" gap={1}>
                            <AudioButtonIcon/>
                            <ReplayAudioButton/>
                        </Stack>
                    </Stack>
                    <TextField
                        variant={"outlined"}
                        name={"markup"}
                        value={markup}
                        disabled={playing || loading}
                        onChange={handleMarkupChange}
                        required
                        error={!!error}
                        helperText={error ?? `${markup.length}/${MAX_LENGTH}`}
                        fullWidth={true}
                        multiline={true}
                        rows={12}
                        sx={{paddingTop: 1.5}}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{px: '24px', pb: '20px'}}>
                <Stack direction={"row"} gap={1}>
                    <Button variant="outlined" onClick={onClose} disableElevation>{t("common.close")}</Button>
                    <Button variant="contained" onClick={handleSaveAudio} startIcon={<SaveIcon/>} disableElevation>{t("common.save")}</Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}

const VoiceSelect = (
    {voice, setVoice}: { voice: string, setVoice: (voice: string) => void }
) => {
    const voiceOptions = [
        {
            value: "FEMALE_1",
            name: "Female 1"
        },
        {
            value: "MALE_1",
            name: "Male 1"
        }
    ]

    return (
        <TextField
            name={"voice"}
            size="small"
            value={voice}
            onChange={event => setVoice(event.target.value)}
            select
            defaultValue="FEMALE_1"
            label={"Voice"}
        >
            {voiceOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.name}</MenuItem>
            ))}
        </TextField>
    )
}

const generateAudioAsync = async (input: AudioPreviewRequest) => {
    const {audio} = await audioService.generateAudioPreview(input)
    return await assetService.getTmpAudio(audio.key)
}