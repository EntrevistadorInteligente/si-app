"use client"

import logout from '@/app/auth/libs/logout';

export default function Logout() {
  return <button onClick={() => logout()}>
    Signout of keycloak
  </button>
}