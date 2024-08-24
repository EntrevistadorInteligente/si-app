import { Log, UserManager } from "oidc-client-ts";
import { settings } from "@/modules/auth/authConfig";

Log.setLogger(console);
Log.setLevel(Log.DEBUG);

console.log(settings)
export const userManager = new UserManager(settings);

export async function signinRedirectCallback() {
  try {
    return await userManager.signinRedirectCallback();
  } catch (error) {
    console.error('Error handling redirect callback:', error);
  }
}

export async function signinCallback() {
  try {
    return await userManager.signinCallback();
  } catch (error) {
    console.error('Error handling redirect callback:', error);
  }
}

export async function signinRedirect() {
  await userManager.signinRedirect();
}

export async function getUser() {
  return await userManager.getUser();
}

export async function signoutRedirect() {
  await userManager.signoutRedirect();
}