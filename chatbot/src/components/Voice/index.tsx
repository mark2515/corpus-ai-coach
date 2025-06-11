import React, { useState, useEffect, useMemo } from "react";
import { ActionIcon } from "@mantine/core";
import {
  IconMicrophone,
  IconLoader2,
  IconPointer,
  IconCircle,
} from "@tabler/icons-react";
import * as chatStorage from "@/utils/chatStorage";
import { Assistant, MessageList } from "@/types";
import MicroRecorder from "mic-recorder-to-mp3";

const Mp3Recorder = new MicroRecorder({
  bitRate: 1128,
});

export function Voice({
  sessionId,
  assistant,
}: {
  sessionId: string;
  assistant: Assistant;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isGranted, setIsGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isDisabled = useMemo(() => {
    return isLoading || !isGranted || isPlaying;
  }, [isLoading, isGranted, isPlaying]);

  // get audio granted
  useEffect(() => {
    (navigator as any).getUserMedia(
      { audio: true },
      () => {
        setIsGranted(true);
      },
      () => {
        setIsGranted(false);
      },
    );
  });
  const start = () => {
    Mp3Recorder.start().then(() => {
      setIsRecording(true);
    });
  };
  const end = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]: any) => {
        setIsRecording(false);
        answer(blob);
      });
  };
  const updateMessage = (message: MessageList) => {
    const list = chatStorage.getMessage(sessionId);
    chatStorage.updateMessage(sessionId, [...list, ...message]);
  };

  const answer = async (blob: Blob) => {
    setIsLoading(true);
    let history = chatStorage.getMessage(sessionId);
    let options = assistant;
    const formData = new FormData();
    formData.append("file", blob, "prompt.mp3");
    formData.append("options", JSON.stringify(options));
    formData.append(
      "history",
      JSON.stringify(history.slice(-assistant.max_log)),
    );
    const resp = await fetch("/api/voice", {
      method: "POST",
      body: formData,
    });
    const { audioUrl, transcription, completion } = await resp.json();
    setIsLoading(false);
    updateMessage([
      {
        role: "user",
        content: transcription,
      },
      {
        role: "assistant",
        content: completion,
      },
    ]);
    const audioElement = new Audio(`data:audio/wav;base64,${audioUrl}`);
    audioElement.addEventListener("play", () => {
      setIsPlaying(true);
    });
    audioElement.addEventListener("ended", () => {
      setIsPlaying(false);
    });
    audioElement.play();
    console.log(resp);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {isLoading ? (
        <div className="flex items-center">
          <IconLoader2 size="1rem" className="animate-spin mr-2"></IconLoader2>
          Loading...
        </div>
      ) : isPlaying ? (
        <div className="flex items-center">
          <IconCircle className="animate-ping mr-2" size="1rem"></IconCircle>
          Playing
        </div>
      ) : (
        <div className="text-gray-600 flex items-center">
          <IconPointer className="mr-2" size="1rem"></IconPointer>
          Hold to ask
        </div>
      )}

      <ActionIcon
        className="mt-4"
        size="4rem"
        disabled={isDisabled}
        onMouseDown={start}
        onMouseUp={end}
      >
        <IconMicrophone color={isRecording ? "red" : "green"}></IconMicrophone>
      </ActionIcon>
    </div>
  );
}