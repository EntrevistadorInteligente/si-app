import { User } from 'next-auth';
import { UserRepositoryPort } from '../../domain/port/userRepositoryPort';

const KEYCLOAK_BASE_URL = process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL;
const REALM = 'entrevistador';
const ADMIN_CLIENT_ID = process.env.NEXT_PUBLIC_ADMIN_CLIENT_ID;
const ADMIN_CLIENT_SECRET = process.env.NEXT_PUBLIC_ADMIN_CLIENT_SECRET;


export const createUserRepositoryAdapter = (): UserRepositoryPort => {
  return {
    updateUserRole: async (email: string, newRole: string): Promise<User> => {
      //newRole = 'basic_subscriber';
      try {
        // 1. Obtener token de acceso admin
        const tokenResponse = await fetch(
          `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/token`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              grant_type: 'client_credentials',
              client_id: ADMIN_CLIENT_ID!,
              client_secret: ADMIN_CLIENT_SECRET!,
            }),
          }
        );
        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) {
          throw new Error('No se pudo obtener el token de acceso admin');
        }
        const adminAccessToken = tokenData.access_token;

        // 2. Buscar usuario por email
        const userResponse = await fetch(
          `${KEYCLOAK_BASE_URL}/admin/realms/${REALM}/users?email=${encodeURIComponent(email)}`,
          {
            headers: { Authorization: `Bearer ${adminAccessToken}` },
          }
        );
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(`Error al buscar usuario: ${userResponse.status} ${userResponse.statusText} - ${JSON.stringify(errorData)}`);
        }
        const userData = await userResponse.json();

        if (!Array.isArray(userData) || userData.length === 0) {
          throw new Error('Usuario no encontrado');
        }

        const userId = userData[0].id;

        // 3. Obtener roles de realm y encontrar el rol deseado
        const rolesResponse = await fetch(
          `${KEYCLOAK_BASE_URL}/admin/realms/${REALM}/roles`,
          {
            headers: { Authorization: `Bearer ${adminAccessToken}` },
          }
        );

        
        if (!rolesResponse.ok) {
          const errorText = await rolesResponse.text();
          throw new Error(`Error al obtener roles: ${rolesResponse.status} ${rolesResponse.statusText} - ${errorText}`);
        }
        const roles = await rolesResponse.json();
        console.log(roles);
        console.log(newRole);
        const role = roles.find((r: any) => r.name === newRole);
        if (!role) {
          throw new Error(`Rol ${newRole} no encontrado`);
        }

        // 4. Asignar el rol al usuario
        const assignRoleResponse = await fetch(
          `${KEYCLOAK_BASE_URL}/admin/realms/${REALM}/users/${userId}/role-mappings/realm`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${adminAccessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify([{
              id: role.id,
              name: role.name,
            }]),
          }
        );
        if (!assignRoleResponse.ok) {
          const errorText = await assignRoleResponse.text();
          throw new Error(`Error al asignar rol: ${assignRoleResponse.status} ${assignRoleResponse.statusText} - ${errorText}`);
        }

        // 5. Obtener usuario actualizado (opcional)
        const updatedUserResponse = await fetch(
          `${KEYCLOAK_BASE_URL}/admin/realms/${REALM}/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${adminAccessToken}` },
          }
        );
        if (!updatedUserResponse.ok) {
          const errorData = await updatedUserResponse.json();
          throw new Error(`Error al obtener usuario actualizado: ${updatedUserResponse.status} ${updatedUserResponse.statusText} - ${JSON.stringify(errorData)}`);
        }
        const updatedUserData = await updatedUserResponse.json();

        return updatedUserData as User;
      } catch (error) {
        console.error('Error al actualizar el rol del usuario en Keycloak:', error);
        throw error;
      }
    }
  }
}
