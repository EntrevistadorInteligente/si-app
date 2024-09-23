import { User } from 'next-auth';
import { UserRepositoryPort } from '../../domain/port/userRepositoryPort';

const KEYCLOAK_BASE_URL = 'https://keycloak.pruebas-entrevistador-inteligente.site';
const REALM = 'entrevistador';
const CLIENT_ID ="admin-cli";
const CLIENT_SECRET = "KcJhk4pyGHSyvlfUhk2SDbEfbqrRP4qh";

export const createUserRepositoryAdapter = (): UserRepositoryPort => {
  return {
    updateUserRole: async (email: string, newRole: string): Promise<User> => {
      try {
        // 1. Obtener token de acceso
        const tokenResponse = await fetch(
          `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/token`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              grant_type: 'client_credentials',
              client_id: CLIENT_ID!,
              client_secret: CLIENT_SECRET!,
            }),
          }
        );
        const tokenData = await tokenResponse.json();
        console.log("TOKEN_DATA", tokenData)
        if (!tokenData.access_token) {
          throw new Error('Failed to obtain access token');
        }
        const accessToken = tokenData.access_token;
        console.log("Email", email)
        // 2. Buscar usuario por email
        const userResponse = await fetch(
          `${KEYCLOAK_BASE_URL}/admin/realms/${REALM}/users?email=${encodeURIComponent(email)}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          console.error("User search error:", errorData);
          throw new Error(`Failed to search user: ${userResponse.status} ${userResponse.statusText}`);
        }
        const userData = await userResponse.json();

        if (!Array.isArray(userData) || userData.length === 0) {
          throw new Error('User not found');
        }

        const userId = userData[0].id;

        console.log("newRole", newRole)

        // 3. Actualizar rol del usuario
        const updateResponse = await fetch(
          `${KEYCLOAK_BASE_URL}/admin/realms/${REALM}/users/${userId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ attributes: { role: [newRole] } }),
          }
        );
        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          console.error("Update role error:", errorData);
          throw new Error(`Failed to update user role: ${updateResponse.status} ${updateResponse.statusText}`);
        }

        // 4. Obtener usuario actualizado
        const updatedUserResponse = await fetch(
          `${KEYCLOAK_BASE_URL}/admin/realms/${REALM}/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!updatedUserResponse.ok) {
          const errorData = await updatedUserResponse.json();
          console.error("Get updated user error:", errorData);
          throw new Error(`Failed to get updated user: ${updatedUserResponse.status} ${updatedUserResponse.statusText}`);
        }
        const updatedUserData = await updatedUserResponse.json();

        return updatedUserData as User;
      } catch (error) {
        console.error('Error updating user role in Keycloak:', error);
        throw error;
      }
    }
  }
}