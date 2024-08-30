'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import SeniorityButton, { ExperienceLevel } from '@/components/custom/seniority-button'

type JobCategory = 'Frontend' | 'Backend' | 'Fullstack' | 'DevOps'

const jobCategories: { [key in JobCategory]: string } = {
  Frontend: 'Focus on user interfaces and client-side logic',
  Backend: 'Focus on server-side logic and databases',
  Fullstack: 'Work in both frontend and backend development',
  DevOps: 'Focus on deployment, integration, and development operations'
}

export default function DemoPage() {
  const [selectedJob, setSelectedJob] = useState<JobCategory | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (selectedJob && !selectedLevel) {
      setShowTooltip(true)
    } else {
      setShowTooltip(false)
    }
  }, [selectedJob, selectedLevel])

  const handleJobSelect = (job: JobCategory) => {
    setSelectedJob(job)
    setSelectedLevel(null)
  }

  const handleLevelSelect = (job: JobCategory, level: ExperienceLevel) => {
    setSelectedJob(job)
    setSelectedLevel(level)
  }

  return (
    <TooltipProvider>
      <div className='max-w-4xl mx-auto p-6 space-y-6 flex flex-col justify-center min-h-screen'>
        <h1 className='sm:text-4xl text-2xl font-bold text-center mb-8 text-balance sm:px-28'>
          Please chose the job you’re looking for?
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr'>
          {(Object.keys(jobCategories) as JobCategory[]).map(job => (
            <Tooltip key={job} open={selectedJob === job && showTooltip}>
              <TooltipTrigger asChild>
                <Card
                  className={`border-none shadow-card h-full cursor-pointer transition-all rounded-2xl flex flex-col ${
                    selectedJob === job ? 'ring-4 ring-[#6464DF] ring-inset' : 'hover:ring-2 hover:ring-primary/50'
                  }`}
                  onClick={() => handleJobSelect(job)}
                >
                  <CardHeader>
                    <CardTitle>{job}</CardTitle>
                  </CardHeader>
                  <CardContent className='flex flex-col flex-grow'>
                    <p className='text-sm text-muted-foreground mb-4 flex-grow'>{jobCategories[job]}</p>
                    <div className='flex flex-wrap gap-2'>
                      {(['Junior', 'Intermedio', 'Senior'] as ExperienceLevel[]).map(level => (
                        <SeniorityButton
                          key={level}
                          level={level}
                          isSelected={selectedJob === job && selectedLevel === level}
                          onClick={e => {
                            e.stopPropagation()
                            handleLevelSelect(job, level)
                          }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Por favor, selecciona un nivel de experiencia</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
