import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { SquareIcon, RefreshCcw } from 'lucide-react'
import { Configuration, NewSessionData, StreamingAvatarApi } from "@heygen/streaming-avatar"

interface VideoCallProps {
  selectedAvatar: any;
  streamingToken: string;
  cameraId: string;
  microphoneId: string;
  onEndInterview: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  selectedAvatar,
  streamingToken,
  cameraId,
  microphoneId,
  onEndInterview
}) => {
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const avatarVideoRef = useRef<HTMLVideoElement>(null);
  const [userStream, setUserStream] = useState<MediaStream | null>(null);
  const [avatarStream, setAvatarStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<NewSessionData | null>(null);
  const avatarApiRef = useRef<StreamingAvatarApi | null>(null);

  useEffect(() => {
    initializeStreams();
    return () => {
      stopStreams();
    };
  }, []);

  const initializeStreams = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: cameraId } },
        audio: { deviceId: { exact: microphoneId } }
      });
      setUserStream(stream);

      avatarApiRef.current = new StreamingAvatarApi(
        new Configuration({
          accessToken: streamingToken,
        })
      );

      const res = await avatarApiRef.current.createStartAvatar({
        newSessionRequest: {
          quality: 'high',
          avatarName: selectedAvatar.avatar_id,
          voice: { voiceId: '077ab11b14f04ce0b49b5f6e5cc20979' },
        },
      });

      setSessionData(res);
      setAvatarStream(avatarApiRef.current.mediaStream);
    } catch (err) {
      console.error('Error initializing streams:', err);
      setCameraError('Failed to start video call. Please try again.');
    }
  };

  const stopStreams = () => {
    if (userStream) {
      userStream.getTracks().forEach(track => track.stop());
    }
    if (avatarApiRef.current && sessionData) {
      avatarApiRef.current.stopAvatar({
        stopSessionRequest: { sessionId: sessionData.sessionId },
      });
    }
  };

  const retryCamera = () => {
    setCameraError(null);
    initializeStreams();
  };

  useEffect(() => {
    if (userStream && userVideoRef.current) {
      userVideoRef.current.srcObject = userStream;
    }
  }, [userStream]);

  useEffect(() => {
    if (avatarStream && avatarVideoRef.current) {
      avatarVideoRef.current.srcObject = avatarStream;
    }
  }, [avatarStream]);

  const handleEndInterview = () => {
    stopStreams();
    onEndInterview();
  };

  return (
    <div className="flex-grow relative bg-gray-200 rounded-lg overflow-hidden">
      <div className="absolute top-4 left-4 z-10 md:w-1/4 w-1/3">
        {cameraError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Camera Error:</strong>
            <span className="block sm:inline"> {cameraError}</span>
            <button 
              className="absolute top-0 right-0 px-4 py-3" 
              onClick={retryCamera}
            >
              <RefreshCcw className="h-5 w-5 text-red-500" />
            </button>
          </div>
        ) : (
          <video
            ref={userVideoRef}
            className="w-full rounded-lg"
            autoPlay
            playsInline
            muted
          />
        )}
      </div>
      <div className="w-full h-full flex items-center justify-center">
        {avatarStream ? (
          <video
            ref={avatarVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>Waiting for avatar stream...</p>
        )}
      </div>
      <div className="absolute bottom-4 right-4 space-x-2">
        <Button 
          className="bg-black text-white hover:bg-gray-800" 
          onClick={handleEndInterview}
        >
          <SquareIcon className="size-4 mr-2" />
          End Interview
        </Button>
      </div>
    </div>
  );
};