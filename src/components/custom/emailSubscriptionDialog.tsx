import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormProvider, UseFormReturn } from 'react-hook-form'

// Make the type generic to accept the form type from the parent
interface EmailSubscriptionDialogProps<T extends { email: string }> {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: T) => void
    emailSent: boolean
    isTermsAccepted: boolean
    setIsTermsAccepted: (value: boolean) => void
    errorValidation: boolean
    methods: UseFormReturn<T>
}

// Use generic type parameter
const EmailSubscriptionDialog = <T extends { email: string }>({
    isOpen,
    onClose,
    onSubmit,
    emailSent,
    isTermsAccepted,
    setIsTermsAccepted,
    errorValidation,
    methods
}: EmailSubscriptionDialogProps<T>) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = methods

    const handleFormSubmit = (formData: T) => {
        onSubmit(formData)
    }

    return (
        <FormProvider {...methods}>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle>
                            {emailSent ? '¡Correo enviado con éxito!' : 'Gracias por completar la entrevista'}
                        </DialogTitle>
                        {!emailSent && (
                            <DialogDescription className='text-sm text-gray-500 text-justify'>
                                Si deseas recibir el feedback de la entrevista, ingresa tu correo electrónico y suscríbete a nuestro
                                boletín.
                            </DialogDescription>
                        )}
                    </DialogHeader>
                    {!emailSent ? (
                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                            <div className='grid gap-4 py-4'>
                                <div className='grid grid-cols-3 gap-4'>
                                    <label htmlFor='email' className='text-sm font-medium text-gray-700'>
                                        Email
                                    </label>
                                    <Input
                                        id='email'
                                        type='email'
                                        className='col-span-3'
                                        placeholder='Escribe tu correo aquí.'
                                        {...register('email', {
                                            required: 'El correo es obligatorio.',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Por favor ingresa un correo válido.'
                                            }
                                        })}
                                    />
                                </div>
                                {errors.email && <p className='text-sm text-red-500'>{errors.email.message as string}</p>}
                                {errorValidation && <p className='text-sm text-red-500'>Por favor verifica los datos ingresados.</p>}
                                <div className='flex items-center space-x-2'>
                                    <input
                                        type='checkbox'
                                        id='terms'
                                        checked={isTermsAccepted}
                                        onChange={e => setIsTermsAccepted(e.target.checked)}
                                        className='rounded border-gray-300 text-primary focus:ring-primary'
                                    />
                                    <label htmlFor='terms' className='text-sm text-gray-700'>
                                        Acepto los{' '}
                                        <a href='/terms-and-conditions' target='_blank' className='text-primary underline'>
                                            términos y condiciones
                                        </a>
                                    </label>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type='submit' disabled={!isTermsAccepted}>
                                    Enviar email
                                </Button>
                            </DialogFooter>
                        </form>
                    ) : (
                        <DialogFooter>
                            <Button onClick={onClose}>Cerrar</Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        </FormProvider>
    )
}

export default EmailSubscriptionDialog
