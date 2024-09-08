import React, { useEffect, useRef, useState } from 'react'
import { Configuration, NewSessionData, StreamingAvatarApi } from '@heygen/streaming-avatar'
import * as faceapi from 'face-api.js'
import { createFaceRepositoryAdapter } from '@/modules/face_proccesor/infrastructure/adapter/faceRepositoryAdapter'
import { createFaceService } from '@/modules/face_proccesor/application/service/faceService'
import UserCamera from '@/components/custom/interview/video-call/userCamera'
import { isLookingStraight } from '@/lib/lookingUtils'
import AvatarVideo from '@/components/custom/interview/video-call/avatarVideo'
import { EndInterviewButton } from '@/components/custom/interview/video-call/endInterviewButtonProps'

interface VideoCallProps {
  selectedAvatar: any;
  streamingToken: string;
  cameraId: string;
  microphoneId: string;
  onEndInterview: () => void;
  isAllowSave: boolean;
}

type FaceDataState = {
  expressions: faceapi.FaceExpressions;
  landmarks: faceapi.FaceLandmarks68;
}

const faceRepository = createFaceRepositoryAdapter()
const faceService    = createFaceService(faceRepository)

export const VideoCall: React.FC<VideoCallProps> = ({
  selectedAvatar,
  streamingToken,
  cameraId,
  microphoneId,
  onEndInterview,
  isAllowSave
}) => {
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const avatarVideoRef = useRef<HTMLVideoElement>(null);
  const [userStream, setUserStream] = useState<MediaStream | null>(null);
  const [avatarStream, setAvatarStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<NewSessionData | null>(null);
  const [faceData, setFaceData] = useState<FaceDataState[]>([]);
  const avatarApiRef = useRef<StreamingAvatarApi | null>(null);
  const [isLookingToCamera, setIsLookingToCamera] = useState<boolean>(false);

  useEffect(() => {
    initializeStreams()
    return () => {
      stopStreams()
    }
  }, [])

  const initializeStreams = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: cameraId } },
        audio: { deviceId: { exact: microphoneId } }
      })
      setUserStream(stream)

      avatarApiRef.current = new StreamingAvatarApi(
        new Configuration({
          accessToken: streamingToken
        })
      )

      const res = await avatarApiRef.current.createStartAvatar({
        newSessionRequest: {
          quality: 'high',
          avatarName: selectedAvatar.avatar_id,
          voice: { voiceId: '077ab11b14f04ce0b49b5f6e5cc20979' }
        }
      })

      setSessionData(res)
      setAvatarStream(avatarApiRef.current.mediaStream)
    } catch (err) {
      console.error('Error initializing streams:', err)
      setCameraError('Failed to start video call. Please try again.')
    }
  }

  const stopStreams = () => {
    if (userStream) {
      userStream.getTracks().forEach(track => track.stop())
    }
    if (avatarApiRef.current && sessionData) {
      avatarApiRef.current.stopAvatar({
        stopSessionRequest: { sessionId: sessionData.sessionId }
      })
    }
  }

  const retryCamera = () => {
    setCameraError(null)
    initializeStreams()
  }

  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/weights'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/weights'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/weights'),
      faceapi.nets.faceExpressionNet.loadFromUri('/weights')
    ]).then(() => {
      detectFaceAndSaveFaceData()
    })
  }

  const detectFaceAndSaveFaceData = () => {
    setInterval(async () => {
      if (userVideoRef.current && isAllowSave) {
        const detections = await faceapi.detectAllFaces(userVideoRef.current,
          new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
        if (detections.length > 0) {
          const newFaceData = detections
            .map(({ expressions, landmarks }) => {
              setIsLookingToCamera(isLookingStraight(landmarks));
              return {
                expressions: expressions,
                landmarks: landmarks
              }
            })
          setFaceData((prevState) => [...prevState, ...newFaceData])
        }
      }
    }, 300)
  }

  useEffect(() => {
    if (userStream && userVideoRef.current) {
      userVideoRef.current.srcObject = userStream
      loadModels()
    }
  }, [userStream])

  useEffect(() => {
    if (avatarStream && avatarVideoRef.current) {
      avatarVideoRef.current.srcObject = avatarStream
    }
  }, [avatarStream])

  const handleEndInterview = async () => {
    stopStreams()
    onEndInterview()
    if (isAllowSave) {
      await faceService.save(faceData)
    }
  }

  return (
    <div className="flex-grow relative bg-gray-200 rounded-lg overflow-hidden">
      <UserCamera cameraError={cameraError} onClick={retryCamera} ref={userVideoRef}
                  isLookingToCamera={isLookingToCamera} />
      <AvatarVideo avatarStream={avatarStream} ref={avatarVideoRef} />
      <EndInterviewButton onClick={handleEndInterview} />
    </div>
  )
}