import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import {Alert, Button, MenuItem, Stack, TextField, Typography} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
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
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {useApplicationContext, useTokenCount} from "../hooks";
import {useHandleError} from "../../http/errorHandler";

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
    const {refreshCustomer} = useApplicationContext();
    const [markup, setMarkup] = useState("");
    const [voice, setVoice] = useState("FEMALE_1");
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
    const {t, i18n} = useTranslation();
    const handleError = useHandleError();

    const setDefaults = useCallback(() => {
        setMarkup(props.input.markup ?? "")
        setVoice(props.input.voice ?? "FEMALE_1")
        setAudioUrl(undefined)
        setLoading(false)
        setPlaying(false)
    }, [props.input.markup, props.input.voice]);

    useEffect(() => {
        setDefaults()
        return () => {
            audio.pause()
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

    useEffect(() => {
        setAudioUrl(undefined)
    }, [markup, voice]);

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

    const handleMarkupChange = (content: string) => {
        setPlaying(false)
        setMarkup(content)
    }

    const handleVoiceChange = (voice: string) => {
        setPlaying(false)
        setVoice(voice)
    }

    const handleSaveAudio = useCallback(() => {
        if (!markup || markup.length === 0) {
            props.handleSave(undefined, undefined)
            return
        }
        props.handleSave(markup, voice)
    }, [markup, voice, props]);

    const generateAudioAsync = async (input: AudioPreviewRequest) => {
        const {audio} = await audioService.generateAudioPreview(input)
        return await assetService.getAssetPreSignedUrl({assetId: audio.key, assetType: "tmp"})
    }

    const clickAudioButton = useCallback(async () => {

        if (audioUrl) {
            if (playing) setPlaying(false)
            else setPlaying(true)
        } else {
            if (props.input.key && props.input.markup === markup && props.input.voice === voice) {
                try {
                    setLoading(true)
                    if (playing) setPlaying(false)
                    const response = await assetService.getAssetPreSignedUrl({assetId: props.input.key, assetType: "audios"})
                    setAudioUrl(response.url)
                    setPlaying(true)
                } catch (e) {
                    handleError("error.audioGeneration", e)
                } finally {
                    setLoading(false)
                }

            } else {
                try {
                    setLoading(true)
                    const response = await generateAudioAsync({
                        markup: markup,
                        voice: voice,
                        lang: props.input.lang,
                    })
                    setAudioUrl(response.url)
                    setPlaying(true)
                    refreshCustomer()
                } catch (e) {
                    handleError("error.audioGeneration", e)
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
                <Button onClick={() => setPlaying(false)} startIcon={<PauseIcon/>} variant="contained" disableElevation>
                    {t("dialog.audio.pause")}
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
                {audioUrl ? t("dialog.audio.listen") : t("dialog.audio.tryIt")}
            </LoadingButton>
        )
    }

    const ReplayAudioButton = () => {
        if (audioUrl) {
            return (
                <Button onClick={clickReplayAudioButton} startIcon={<StopIcon/>} variant="outlined" disableElevation>
                    {t('dialog.audio.replay')}
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
                    <Stack gap={2} pb={2}>
                        <Typography>{t("dialog.audio.description")}</Typography>
                        <Alert severity="info">
                            <Trans i18nKey='dialog.audio.abbrAudioInfo'/>
                        </Alert>
                        {i18n.language === "pl" &&
                            <Alert severity="info">
                                <Trans i18nKey='dialog.audio.plAudioInfo'/>
                            </Alert>
                        }
                    </Stack>
                </DialogContentText>

                <Stack pt={4} gap={2}>
                    <Stack direction={"row"} display="flex" flexDirection={"row"} spacing={1} justifyContent="end">
                        <Stack direction="row" gap={3} flexGrow={1} justifyItems="start" alignItems={"center"}>
                            <CircleFlag countryCode={langMap.get(props.input.lang) ?? ""} height="32"/>
                            <VoiceSelect voice={voice} setVoice={handleVoiceChange}/>
                        </Stack>
                        <Stack direction="row" gap={1}>
                            <TokenCounter/>
                            <AudioButtonIcon/>
                            <ReplayAudioButton/>
                        </Stack>
                    </Stack>
                    <Stack position="relative">
                        <TextField
                            multiline
                            variant="outlined"
                            placeholder={t("dialog.audio.audioEditorPlaceholder")}
                            rows={10}
                            value={markup}
                            onChange={event => handleMarkupChange(event.target.value.slice(0, 2000))}
                            slotProps={{
                                htmlInput: {
                                    maxLength: 2000
                                }
                            }}
                            fullWidth
                        />
                        <Typography
                            variant="caption"
                            sx={{
                                position: "absolute",
                                left: 8,
                                bottom: -24,
                                color: "text.secondary",
                                pointerEvents: "none"
                            }}
                        >
                            {`${markup.length} / 2000`}
                        </Typography>
                    </Stack>
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

const TokenCounter = () => {
    const {counter} = useTokenCount()

    return (
        <Stack direction={"row"} gap={2} alignItems={"center"} mr={2}>
            <AutoAwesomeIcon fontSize={"medium"}/>
            <Typography variant={"body1"}>{counter}</Typography>
        </Stack>
    )
}

const VoiceSelect = (
    {voice, setVoice}: { voice: string, setVoice: (voice: string) => void }
) => {
    const voiceOptions = [
        {
            value: "FEMALE_1",
            name: "Ewa (premium)"
        },
        {
            value: "MALE_1",
            name: "Adam (premium)"
        },
        {
            value: "FEMALE_2",
            name: "Anna (standard)"
        },
        {
            value: "MALE_2",
            name: "Piotr (standard)"
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
            // label={"Voice"}
        >
            {voiceOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                    <Stack direction={"row"} gap={1.5}>
                        <RecordVoiceOverOutlinedIcon color={"primary"}/>
                        {option.name}
                    </Stack>
                </MenuItem>
            ))}
        </TextField>
    )
}