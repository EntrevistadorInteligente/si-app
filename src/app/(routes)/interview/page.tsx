'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Upload,
  Send,
  Link as LinkIcon,
  Mic,
  Video,
  ArrowLeft
} from 'lucide-react'

interface WorkExperience {
  company: string
  position: string
  duration: string
  highlights: string[]
}

interface Language {
  name: string
  proficiency: string
}

interface DeveloperAnalysis {
  name: string
  technicalSkills: string[]
  mainTechnologies: string[]
  workExperiences: WorkExperience[]
  languages: Language[]
  education: string
  certifications: string[]
  softSkills: string[]
}

interface JobOffer {
  title: string
  profile: string
  seniority: string
  description: string
  companyName: string
  country: string
}

interface Message {
  role: 'user' | 'ai'
  content: string
}

const mockDeveloperAIAnalysis = (): DeveloperAnalysis => {
  return {
    name: 'Alex Johnson',
    technicalSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
    mainTechnologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    workExperiences: [
      {
        company: 'Tech Innovators Inc.',
        position: 'Senior Frontend Developer',
        duration: '2019 - Present',
        highlights: [
          "Led a team of 5 developers in redesigning the company's main product UI",
          'Implemented CI/CD pipeline, reducing deployment time by 40%',
          'Mentored junior developers and conducted code reviews'
        ]
      },
      {
        company: 'DataSoft Solutions',
        position: 'Full Stack Developer',
        duration: '2016 - 2019',
        highlights: [
          'Developed and maintained multiple client-facing web applications',
          'Optimized database queries, improving application performance by 30%',
          'Collaborated with UX team to implement responsive designs'
        ]
      }
    ],
    languages: [
      { name: 'English', proficiency: 'Native' },
      { name: 'Spanish', proficiency: 'Intermediate' }
    ],
    education: 'B.S. in Computer Science, Tech University (2016)',
    certifications: ['AWS Certified Developer', 'MongoDB Certified Developer'],
    softSkills: ['Team leadership', 'Problem-solving', 'Communication', 'Agile methodologies']
  }
}

const mockGetAIResponse = async (message: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return `This is a mock AI response to: "${message}". In a real implementation, this would be an actual response from an AI model based on the CV analysis and job offer details.`
}

export default function AIInterviewProcess() {
  const [file, setFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<DeveloperAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [jobOffer, setJobOffer] = useState<JobOffer>({
    title: '',
    profile: '',
    seniority: '',
    description: '',
    companyName: '',
    country: ''
  })
  const [jobOfferLink, setJobOfferLink] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [animationKey, setAnimationKey] = useState(0)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
      setAnalysis(null)
      setError(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a CV file first.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = mockDeveloperAIAnalysis()
      setAnalysis(result)
      setStep(2)
      setAnimationKey(prev => prev + 1)
    } catch (err) {
      setError('An error occurred during analysis. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    setStep(step + 1)
    setAnimationKey(prev => prev + 1)
  }

  const handleJobOfferChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setJobOffer(prev => ({ ...prev, [name]: value }))
  }

  const handleSeniorityChange = (value: string) => {
    setJobOffer(prev => ({ ...prev, seniority: value }))
  }

  const handleJobOfferSubmit = () => {
    if (
      jobOffer.title &&
      jobOffer.profile &&
      jobOffer.seniority &&
      jobOffer.description &&
      jobOffer.companyName &&
      jobOffer.country
    ) {
      console.log('Job offer submitted:', jobOffer)
      setStep(4)
      setAnimationKey(prev => prev + 1)
      initializeChat()
    } else {
      setError('Please fill in all fields for the job offer.')
    }
  }

  const handleJobOfferLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobOfferLink(e.target.value)
  }

  const handleJobOfferLinkSubmit = async () => {
    if (!jobOfferLink) {
      setError('Please enter a job offer link.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulating fetching job offer from link
      const result: JobOffer = {
        title: 'Senior Frontend Developer',
        profile: 'Experienced React developer',
        seniority: 'senior',
        description: 'We are looking for a senior frontend developer with strong React skills...',
        companyName: 'Tech Innovators Inc.',
        country: 'United States'
      }
      setJobOffer(result)
      setStep(4)
      setAnimationKey(prev => prev + 1)
      initializeChat()
    } catch (err) {
      setError('An error occurred while fetching the job offer. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const initializeChat = () => {
    setMessages([
      {
        role: 'ai',
        content: `Hello! I'm your AI interviewer. Based on your CV and the job offer for ${jobOffer.title} at ${jobOffer.companyName}, let's start the interview. What made you interested in this position?`
      }
    ])
  }

  const handleSend = async () => {
    if (input.trim() === '') return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const aiResponse = await mockGetAIResponse(input)
      const aiMessage: Message = { role: 'ai', content: aiResponse }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        role: 'ai',
        content: "I'm sorry, I encountered an error. Can you please try again?"
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleListening = () => {
    if (!isListening) {
      setStep(5)
      setAnimationKey(prev => prev + 1)
      setIsListening(true)
      // Simulating speech recognition
      setTimeout(() => {
        setTranscript(
          'This is a simulated voice transcript. In a real implementation, this would be the result of speech recognition.'
        )
        setIsListening(false)
      }, 5000)
    } else {
      setIsListening(false)
    }
  }

  const handleVideoCall = () => {
    setStep(6)
    setAnimationKey(prev => prev + 1)
  }

  const handleBackToChat = () => {
    setStep(4)
    setAnimationKey(prev => prev + 1)
    setTranscript('')
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
      <Card className='w-full max-w-4xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-2xl md:text-3xl font-bold text-center'>AI Interview Process</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div key={animationKey} className='animate-fadeIn'>
            {step === 1 && (
              <div className='space-y-4'>
                <h2 className='text-xl font-semibold'>Upload Your CV</h2>
                <div className='flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2'>
                  <Input type='file' accept='.pdf,.doc,.docx' onChange={handleFileChange} className='flex-grow' />
                  <Button onClick={handleAnalyze} disabled={isLoading} className='w-full md:w-auto'>
                    {isLoading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze CV'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 2 && analysis && (
              <div className='space-y-6'>
                <Alert>
                  <CheckCircle className='h-4 w-4' />
                  <AlertTitle>Analysis Complete</AlertTitle>
                  <AlertDescription>Here's the detailed analysis of your CV:</AlertDescription>
                </Alert>

                <div>
                  <h3 className='text-xl font-semibold'>{analysis.name}</h3>
                  <p className='text-muted-foreground'>{analysis.education}</p>
                </div>

                <div>
                  <h4 className='text-lg font-semibold mb-2'>Technical Skills</h4>
                  <div className='flex flex-wrap gap-2'>
                    {analysis.technicalSkills.map((skill, index) => (
                      <Badge key={index} variant='secondary'>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className='text-lg font-semibold mb-2'>Main Technologies</h4>
                  <div className='flex flex-wrap gap-2'>
                    {analysis.mainTechnologies.map((tech, index) => (
                      <Badge key={index} variant='default'>
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className='text-lg font-semibold mb-2'>Work Experience</h4>
                  {analysis.workExperiences.map((exp, index) => (
                    <div key={index} className='mb-4'>
                      <h5 className='font-semibold'>{exp.position}</h5>
                      <p className='text-sm text-muted-foreground'>
                        {exp.company} | {exp.duration}
                      </p>
                      <ul className='list-disc list-inside mt-2'>
                        {exp.highlights.map((highlight, hIndex) => (
                          <li key={hIndex} className='text-sm'>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className='text-lg font-semibold mb-2'>Languages</h4>
                  {analysis.languages.map((lang, index) => (
                    <p key={index}>
                      {lang.name}: {lang.proficiency}
                    </p>
                  ))}
                </div>

                <Separator />

                <div>
                  <h4 className='text-lg font-semibold mb-2'>Additional Information</h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <h5 className='font-semibold'>Certifications</h5>
                      <ul className='list-disc list-inside'>
                        {analysis.certifications.map((cert, index) => (
                          <li key={index} className='text-sm'>
                            {cert}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className='font-semibold'>Soft Skills</h5>
                      <ul className='list-disc list-inside'>
                        {analysis.softSkills.map((skill, index) => (
                          <li key={index} className='text-sm'>
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <Tabs defaultValue='manual' className='w-full'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='manual'>Manual Entry</TabsTrigger>
                  <TabsTrigger value='link'>Job Offer Link</TabsTrigger>
                </TabsList>
                <TabsContent value='manual' className='space-y-4'>
                  <h3 className='text-xl font-semibold'>Enter Job Offer Details</h3>
                  <div className='space-y-2'>
                    <Input
                      type='text'
                      name='title'
                      placeholder='Job Title'
                      value={jobOffer.title}
                      onChange={handleJobOfferChange}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Input
                      type='text'
                      name='profile'
                      placeholder='Profile'
                      value={jobOffer.profile}
                      onChange={handleJobOfferChange}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Select onValueChange={handleSeniorityChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select Seniority' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='junior'>Junior</SelectItem>
                        <SelectItem value='mid-level'>Mid-Level</SelectItem>
                        <SelectItem value='senior'>Senior</SelectItem>
                        <SelectItem value='lead'>Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Textarea
                      name='description'
                      placeholder='Job Description'
                      value={jobOffer.description}
                      onChange={handleJobOfferChange}
                      rows={5}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Input
                      type='text'
                      name='companyName'
                      placeholder='Company Name'
                      value={jobOffer.companyName}
                      onChange={handleJobOfferChange}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Input
                      type='text'
                      name='country'
                      placeholder='Country'
                      value={jobOffer.country}
                      onChange={handleJobOfferChange}
                    />
                  </div>
                  <Button onClick={handleJobOfferSubmit} className='w-full'>
                    Submit Job Offer <Upload className='ml-2 h-4 w-4' />
                  </Button>
                </TabsContent>
                <TabsContent value='link' className='space-y-4'>
                  <h3 className='text-xl font-semibold'>Enter Job Offer Link</h3>
                  <div className='flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2'>
                    <Input
                      type='url'
                      placeholder='https://example.com/job-offer'
                      value={jobOfferLink}
                      onChange={handleJobOfferLinkChange}
                      className='flex-grow'
                    />
                    <Button onClick={handleJobOfferLinkSubmit} disabled={isLoading} className='w-full md:w-auto'>
                      {isLoading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Loading...
                        </>
                      ) : (
                        <>
                          Load Offer <LinkIcon className='ml-2 h-4 w-4' />
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {step === 4 && (
              <div className='h-[400px] md:h-[500px] flex flex-col'>
                <ScrollArea className='flex-grow pr-4 mb-4'>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div className={`flex items-start ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Avatar className='w-8 h-8'>
                          <AvatarFallback>{message.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                          {message.role === 'ai' && <AvatarImage src='/placeholder.svg' alt='AI' />}
                        </Avatar>
                        <div
                          className={`mx-2 p-3 rounded-lg ${
                            message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </ScrollArea>
                <div className='flex items-center space-x-2'>
                  <Input
                    type='text'
                    placeholder='Type your message...'
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className='flex-grow'
                  />
                  <Button onClick={handleSend} disabled={isLoading}>
                    {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Send className='h-4 w-4' />}
                  </Button>
                  <Button onClick={toggleListening} variant='outline'>
                    <Mic className='h-4 w-4' />
                  </Button>
                  <Button onClick={handleVideoCall} variant='outline'>
                    <Video className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className='h-[400px] md:h-[500px] flex flex-col items-center justify-center space-y-4'>
                <div className='text-center'>
                  <h3 className='text-xl font-semibold mb-2'>Voice Detection</h3>
                  {isListening ? (
                    <div className='animate-pulse'>
                      <Mic className='h-16 w-16 text-primary' />
                      <p>Listening...</p>
                    </div>
                  ) : (
                    <div>
                      <CheckCircle className='h-16 w-16 text-green-500 mx-auto' />
                      <p>Voice detected!</p>
                    </div>
                  )}
                </div>
                {transcript && (
                  <div className='w-full max-w-md'>
                    <h4 className='font-semibold mb-2'>Transcript:</h4>
                    <p className='bg-muted p-3 rounded-lg'>{transcript}</p>
                  </div>
                )}
                <Button onClick={handleBackToChat}>
                  <ArrowLeft className='mr-2 h-4 w-4' /> Back to Chat
                </Button>
              </div>
            )}

            {step === 6 && (
              <div className='h-[400px] md:h-[500px] flex flex-col items-center justify-center space-y-4'>
                <div className='text-center'>
                  <h3 className='text-xl font-semibold mb-2'>Video Call</h3>
                  <div className='bg-gray-200 w-full max-w-md h-64 rounded-lg flex items-center justify-center'>
                    <Video className='h-16 w-16 text-gray-400' />
                  </div>
                  <p className='mt-2'>Video call interface would be implemented here.</p>
                </div>
                <Button onClick={handleBackToChat}>
                  <ArrowLeft className='mr-2 h-4 w-4' /> Back to Chat
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className='flex justify-end'>
          {(step === 2 || step === 3) && (
            <Button onClick={handleContinue} className='mt-4'>
              Continue <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
