'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Rols = { id: string; name: string; focus: string }[]

const rols: Rols = [
  { id: 'frontend', name: 'Frontend', focus: 'User interfaces and client-side logic' },
  { id: 'backend', name: 'Backend', focus: 'Server-side logic and databases' },
  { id: 'fullstack', name: 'Fullstack', focus: 'Work in both frontend and backend development' },
  { id: 'devops', name: 'DevOps', focus: 'Deployment, integration, and development operations' }
]

export default function DemoPage() {
  const [selectedRol, setSelectedRol] = useState<string | null>(null)
  const router = useRouter()
  const handleRolSelect = (id: string) => {
    setSelectedRol(id)
    router.push(`/demo/${id}`)
  }

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-6 flex flex-col justify-center min-h-screen'>
      <h1 className='sm:text-4xl text-2xl font-bold text-center mb-8 text-balance sm:px-28'>
        <span className='bg-gradient-to-r from-[#12C2E9] to-[#C471ED] bg-clip-text text-transparent'>Hi there!</span>{' '}
        Please choose a role for your interview.
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr'>
        {rols.map(({ id, name, focus }) => (
          <Card
            key={name}
            className={`border-none shadow-card h-full cursor-pointer transition-all rounded-2xl flex flex-col ${
              selectedRol === id ? 'ring-4 ring-primary ring-inset' : 'hover:ring-inset hover:ring-4 hover:ring-primary'
            }`}
            onClick={() => handleRolSelect(id)}
          >
            <CardHeader className='pb-2'>
              <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col flex-grow'>
              <p className='text-sm text-muted-foreground flex-grow'>{focus}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
