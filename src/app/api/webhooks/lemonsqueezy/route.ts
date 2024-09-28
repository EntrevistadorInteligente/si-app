import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

import { createUserRepositoryAdapter } from '@/modules/interview_manager/infrastructure/adapter/userManagerRepositoryAdapter';
import { createUserService } from '@/modules/interview_manager/application/service/userManagerService';

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('X-Signature');

//   if (!signature || !verifyWebhookSignature(body, signature, process.env.WEBHOOK_SECRET!)) {
//     return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
//   }

  const event = JSON.parse(body);

  switch (event.meta.event_name) {
    case 'subscription_created':
      await handleSubscriptionCreated(event.data.attributes.user_email, event.data.attributes.product_name);
      break;
    case 'subscription_updated':
      await handleSubscriptionEvent(event.data);
      break;
    case 'subscription_cancelled':
      await handleSubscriptionCancelled(event.data);
      break;
    // Manejar otros eventos según sea necesario
  }

  return NextResponse.json({ success: true });
}

async function handleSubscriptionEvent(subscriptionData: any) {
  console.log(subscriptionData);
  const { user_email, product_name, status } = subscriptionData.attributes;
  let newRole = 'user'; // Default role

  // Assign role based on subscription plan
  switch (product_name.toLowerCase()) {
    case 'básico':
      newRole = 'basic_subscriber';
      break;
    case 'pro':
      newRole = 'pro_subscriber';
      break;
  }

  // Only update if the subscription is active
  if (status === 'active') {
    try {
      const updatedUser = await userService.updateUserRole(user_email, newRole);
      console.log('User role updated:', updatedUser);
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  }
}

async function handleSubscriptionCancelled(subscriptionData: any) {
  const { user_email } = subscriptionData.attributes;
  try {
    const updatedUser = await userService.updateUserRole(user_email, 'user'); // Revert to basic role
    console.log('User role reverted to basic:', updatedUser);
  } catch (error) {
    console.error('Failed to revert user role:', error);
  }
}

const userRepositoryAdapter = createUserRepositoryAdapter();
const userService = createUserService(userRepositoryAdapter);

// En tu componente o donde manejes la lógica de suscripción
async function handleSubscriptionCreated(email: string, plan: string) {
  let newRole;
  switch (plan.toLowerCase()) {
    case 'basic_subscriber':
      newRole = 'basic_subscriber';
      break;
    case 'pro_subscriber':
      newRole = 'pro_subscriber';
      break;
    default:
      newRole = 'default-roles-entrevistador';
  }

  try {
    const updatedUser = await userService.updateUserRole(email, newRole);
    console.log('User role updated:', updatedUser);
  } catch (error) {
    console.error('Failed to update user role:', error);
  }
}