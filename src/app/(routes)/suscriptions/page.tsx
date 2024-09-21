'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

const NEXT_PUBLIC_PRO_ANNUAL_VARIANT_ID = process.env.NEXT_PUBLIC_PRO_ANNUAL_VARIANT_ID || '';
const NEXT_PUBLIC_PRO_MONTHLY_VARIANT_ID = process.env.NEXT_PUBLIC_PRO_MONTHLY_VARIANT_ID || '';
const NEXT_PUBLIC_BASIC_ANNUAL_VARIANT_ID = process.env.NEXT_PUBLIC_BASIC_ANNUAL_VARIANT_ID || '';
const NEXT_PUBLIC_BASIC_MONTHLY_VARIANT_ID = process.env.NEXT_PUBLIC_BASIC_MONTHLY_VARIANT_ID || '';


interface PricingPlan {
    name: string;
    features: string[];
    recommended?: boolean;
    variants: {
      monthly: {
        price: number;
        variantId: string;
      };
      annual: {
        price: number;
        variantId: string;
      };
    };
  }

const pricingPlans: PricingPlan[] = [
    {
        name: "Básico",
        features: [
          "5 entrevistas AI al mes",
          "Acceso a avatares básicos",
          "Soporte por email"
        ],
        variants: {
          monthly: {
            price: 9.99,
            variantId: NEXT_PUBLIC_BASIC_MONTHLY_VARIANT_ID
          },
          annual: {
            price: 99.99,
            variantId: NEXT_PUBLIC_BASIC_ANNUAL_VARIANT_ID
          }
        }
      },
  {
    name: "Pro",
    features: [
      "20 entrevistas AI al mes",
      "Acceso a todos los avatares",
      "Análisis de rendimiento básico",
      "Soporte prioritario"
    ],
    recommended: true,
    variants: {
      monthly: {
        price: 19.99,
        variantId: NEXT_PUBLIC_PRO_MONTHLY_VARIANT_ID
      },
      annual: {
        price: 199.99,
        variantId: NEXT_PUBLIC_PRO_ANNUAL_VARIANT_ID
      }
    }
  },
  {
    name: "Empresarial",
    features: [
      "Entrevistas AI ilimitadas",
      "Avatares personalizados",
      "Análisis de rendimiento avanzado",
      "Soporte 24/7",
      "API access"
    ],
    variants: {
      monthly: {
        price: 49.99,
        variantId: "YOUR_ENTERPRISE_MONTHLY_VARIANT_ID"
      },
      annual: {
        price: 499.99,
        variantId: "YOUR_ENTERPRISE_ANNUAL_VARIANT_ID"
      }
    }
  }
]

enum SubscriptionFrequency {
  month = 'monthly',
  year = 'annual'
}

declare global {
    interface Window {
      createLemonSqueezy: () => {
        Setup: (config: any) => any;
        Url: {
          Close: () => void;
        };
      };
    }
  }
  
  export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(false);
    const [isLemonSqueezyLoaded, setIsLemonSqueezyLoaded] = useState(false);
  
    useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://assets.lemonsqueezy.com/lemon.js';
      script.async = true;
      script.onload = () => {
        setIsLemonSqueezyLoaded(true);
        if (typeof window.createLemonSqueezy !== 'undefined') {
          window.createLemonSqueezy();
        }
      };
      document.body.appendChild(script);
  
      return () => {
        document.body.removeChild(script);
      };
    }, []);
  
    const handleSubscribe = (plan: PricingPlan, isAnnual: boolean) => {
      const variantId = isAnnual
        ? plan.variants.annual.variantId
        : plan.variants.monthly.variantId;

      // Redirigir al usuario a la página de checkout de Lemon Squeezy
      window.location.href = `https://kahop.lemonsqueezy.com/buy/${variantId}`;
    };

    const handleContactUs = () => {
      window.location.href = 'mailto:ventas@tuempresa.com?subject=Consulta%20sobre%20Plan%20Empresarial';
    };

    // Filtrar los planes para excluir el plan Empresarial
    const displayedPlans = pricingPlans.filter(plan => plan.name !== "Empresarial");

    return (
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-10">Planes de Suscripción</h1>
        <div className="flex justify-center items-center mb-8">
          <span className="mr-2">Mensual</span>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <span className="ml-2">Anual</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {displayedPlans.map((plan, index) => (
            <Card key={index} className={`flex flex-col ${plan.recommended ? 'border-primary' : ''}`}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  ${isAnnual ? plan.variants.annual.price : plan.variants.monthly.price}/
                  {isAnnual ? 'año' : 'mes'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="list-disc list-inside space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleSubscribe(plan, isAnnual)}
                  disabled={!isLemonSqueezyLoaded}
                >
                  {isLemonSqueezyLoaded ? 'Seleccionar Plan' : 'Cargando...'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Necesitas un plan personalizado?</h2>
          <p className="mb-6">Ofrecemos soluciones empresariales adaptadas a tus necesidades.</p>
          <Button onClick={handleContactUs} className="bg-secondary text-primary">
            Contáctanos para un Plan Empresarial
          </Button>
        </div>
      </div>
    );
  }