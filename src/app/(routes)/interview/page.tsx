'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
//import { loadStripe } from '@stripe/stripe-js'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Básico",
    price: "9.99",
    description: "Perfecto para empezar",
    features: ["Acceso básico", "Soporte por email", "1 usuario"],
    badge: "Popular",
    priceId: "price_1234567890" // Reemplaza con tu Stripe Price ID real
  },
  {
    name: "Pro",
    price: "19.99",
    description: "Ideal para equipos pequeños",
    features: ["Acceso completo", "Soporte prioritario", "5 usuarios"],
    priceId: "price_0987654321" // Reemplaza con tu Stripe Price ID real
  },
  {
    name: "Empresa",
    price: "49.99",
    description: "Para grandes organizaciones",
    features: ["Acceso completo", "Soporte 24/7", "Usuarios ilimitados"],
    priceId: "price_1122334455" // Reemplaza con tu Stripe Price ID real
  }
]

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubscription = async (priceId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })
      const { sessionId } = await response.json()

    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-4">Planes de Suscripción</h1>
      <p className="text-center text-muted-foreground mb-10">Elige el plan que mejor se adapte a tus necesidades</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{plan.name}</CardTitle>
                {plan.badge && <Badge variant="secondary">{plan.badge}</Badge>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-3xl font-bold mb-4">${plan.price}<span className="text-sm font-normal">/mes</span></p>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubscription(plan.priceId)} 
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Suscribirse'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}