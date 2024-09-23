'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

type Question = {
  idPregunta: string
  pregunta: string
}

type Answer = {
  idPregunta: string
  respuesta: string
}

type Form = {
  [key: string]: string
}

export default function DemoInterviewPage({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [formularioCompleto, setFormularioCompleto] = useState(false)
  const [form, setForm] = useState({})
  const [error, setError] = useState(false)

  const initializeAnswers = (questions: Question[]): Answer[] => {
    return questions.map(question => {
      return {
        idPregunta: question.idPregunta,
        respuesta: ''
      }
    })
  }

  const handleRespuestaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion].respuesta = e.target.value
    setAnswers(newAnswers)
    setError(false)
  }

  const enviarRespuesta = () => {
    if (answers[currentQuestion].respuesta === '') {
      setError(true)
      return
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      const formCompleto: Form = questions.reduce((acc, pregunta, index) => {
        acc[`pregunta${index + 1}`] = answers[index].respuesta
        return acc
      }, {} as Form)
      setForm(formCompleto)
      setFormularioCompleto(true)
    }
  }

  const generateFeedback = () => {
    console.log('Generando feedback para:', form)
    // Aquí iría la lógica para generar el feedback
  }

  const tryAgain = () => {
    setAnswers(initializeAnswers(questions))
    setCurrentQuestion(0)
    setFormularioCompleto(false)
    setForm({})
    setError(false)
  }

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DEMO_PREGUNTAS}?rol=${params.id}`)
        const data: Question[] = await response.json()
        setQuestions(data)
        setAnswers(initializeAnswers(data))
        setLoading(false)
      } catch (error) {
        console.error('Error fetching questions: ', error)
      }
    }
    getQuestions()
  }, [params.id])

  if (loading) {
    return (
      <div className='container mx-auto p-4 flex flex-col justify-center min-h-screen'>
        <h1 className='sm:text-4xl text-2xl font-bold text-center mb-16 w-fit max-w-[470px] mx-auto text-primary'>
          <span className='capitalize bg-gradient-to-r from-[#12C2E9] to-[#C471ED] bg-clip-text text-transparent'>
            {params.id}
          </span>{' '}
          interview, please answer the questions.
        </h1>
        <Card className='w-full max-w-2xl mx-auto mb-4 rounded-2xl shadow-card border-none'>
          <CardContent className='p-6'>
            <Skeleton className='h-6 w-full mb-4' />
            <Skeleton className='h-6 w-1/5 mb-2' />
            <Skeleton className='h-[100px] w-full mb-4' />
            <div className='flex justify-between'>
              <Skeleton className='h-10 w-5' />
              <Skeleton className='h-10 w-32' />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-4 flex flex-col justify-center min-h-screen'>
      <h1 className='sm:text-4xl text-2xl font-bold text-center mb-16 w-fit max-w-[470px] mx-auto text-primary'>
        <span className='capitalize bg-gradient-to-r from-[#12C2E9] to-[#C471ED] bg-clip-text text-transparent'>
          {params.id}
        </span>{' '}
        interview, please answer the questions.
      </h1>
      <Card className='w-full max-w-2xl mx-auto mb-4 rounded-2xl shadow-card border-none'>
        <CardContent className='p-6'>
          {!formularioCompleto ? (
            <>
              <p className='font-bold mb-4 text-primary'>
                {questions[currentQuestion]?.pregunta || 'Cargando preguntas...'}
              </p>
              <p className='text-primary-medium font-semibold mb-2 text-base'>Answer:</p>
              <Textarea
                placeholder='Write your answer here.'
                value={answers[currentQuestion]?.respuesta}
                onChange={handleRespuestaChange}
                className={cn('min-h-[100px] mb-4 max-h-[380px]', error && 'border-red-500 focus-visible:ring-red-500')}
                aria-invalid={error}
                aria-describedby={error ? 'error-message' : undefined}
              />
              {error && (
                <p id='error-message' className='text-red-500 text-sm mb-4'>
                  Please answer the question before continuing.
                </p>
              )}
              <div className='flex justify-between'>
                <div className='flex'>
                  <span className='text-sm font-medium self-end text-primary-medium'>
                    {currentQuestion + 1}/{questions.length || '5'}
                  </span>
                </div>
                <Button onClick={enviarRespuesta} className='bg-primary'>
                  Send answer
                </Button>
              </div>
            </>
          ) : (
            <div className='flex flex-col items-center gap-4 justify-center'>
              <p className='text-lg font-bold'>¡You have completed all the questions!</p>
              <div className='flex gap-4 justify-center'>
                <Button onClick={tryAgain} variant='outline' className='w-full'>
                  Answer again
                </Button>
                <Button onClick={generateFeedback} className='bg-primary w-full'>
                  Generate feedback
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
