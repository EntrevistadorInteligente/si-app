'use client'

import React, { useState, useEffect } from 'react'
import { createVideoChatManagerService } from '@/modules/interview_manager/application/service/videoChatManagerService'
import { createVideoChatManagerRepositoryAdapter } from '@/modules/interview_manager/infrastructure/adapter/videoChatManagerRepositoryAdapter'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { OptionsDialog } from './dialog'
import { VideoCall } from './videoCall'
import { InterviewerList } from './interviewerListProps '

const NEXT_PUBLIC_API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;


interface Avatar {
  avatar_id: string;
  avatar_name: string;
  gender: string;
  preview_image_url: string;
  preview_video_url: string;
}

export default function Page() {
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null)
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [streamingToken, setStreamingToken] = useState<string | null>(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [selectedCameraId, setSelectedCameraId] = useState<string>('')
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState<string>('')
  const [allowSave, setAllowSave] = useState<boolean>(false)

  const videoChatRepositoryPort = createVideoChatManagerRepositoryAdapter();
  const videoChatService = createVideoChatManagerService(videoChatRepositoryPort);

  useEffect(() => {
    const fetchAvatars = async () => {
if (!NEXT_PUBLIC_API_TOKEN) {
        throw new Error("API token is not defined")
      }
      try {
        const response = await fetch('https://api.heygen.com/v2/avatars', {
          headers: {
            'x-api-key': NEXT_PUBLIC_API_TOKEN,
          },
        })
        if (!response.ok) throw new Error('Failed to fetch avatars')
        const data = await response.json()
        const filteredAvatars = data.data.avatars
          .filter((avatar: Avatar) => 
            !avatar.avatar_name.includes('(Left)') && !avatar.avatar_name.includes('(Right)')
          )
          .map((avatar: Avatar) => ({
            ...avatar,
            avatar_name: avatar.avatar_name.replace(' (Front)', '')
          }))
        setAvatars(filteredAvatars)
      } catch (err) {
        setError('Failed to load avatars. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvatars()
  }, [])

  const getStreamingToken = async () => {
    try {
      const response = await videoChatService.getToken()
      if (!response) throw new Error('Failed to get streaming token')
      setStreamingToken(response.token)
    } catch (err) {
      setError('Failed to get streaming token. Please try again.')
    }
  }

  const handleSelectAvatar = (avatar: Avatar) => {
    setSelectedAvatar(avatar)
    getStreamingToken()
    setIsConfirmDialogOpen(true)
  }

  const handleStartInterview = (cameraId: string, microphoneId: string) => {
    setSelectedCameraId(cameraId)
    setSelectedMicrophoneId(microphoneId)
    setIsInterviewStarted(true)
    setIsConfirmDialogOpen(false)
  }

  const handleEndInterview = () => {
    setIsInterviewStarted(false)
    setSelectedAvatar(null)
    setStreamingToken(null)
    setSelectedCameraId('')
    setSelectedMicrophoneId('')
  }
  
  const handleOnAllowSave = (checked: boolean) => {
    setAllowSave(checked)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 h-screen flex flex-col items-center justify-center">
        <Skeleton className="w-[300px] h-[200px] rounded-lg" />
        <Skeleton className="w-[250px] h-[20px] mt-4" />
        <Skeleton className="w-[200px] h-[40px] mt-4" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6">AI Interview Experience</h1>
      
      {!isInterviewStarted ? (
        <InterviewerList 
          avatars={avatars} 
          onSelectAvatar={handleSelectAvatar} 
        />
      ) : (
        <VideoCall
          selectedAvatar={selectedAvatar!}
          streamingToken={streamingToken!}
          cameraId={selectedCameraId}
          microphoneId={selectedMicrophoneId}
          onEndInterview={handleEndInterview}
          isAllowSave={allowSave}
        />
      )}

      <OptionsDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        selectedAvatar={selectedAvatar}
        onStartInterview={handleStartInterview}
        isChecked={allowSave}
        onCheckedChange={handleOnAllowSave}
      />
    </div>
  )
}