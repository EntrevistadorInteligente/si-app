import { TokenVideoChatManager } from '../../domain/model/videoChatManager';
import { VideoChatManagerRepositoryPort } from '../../domain/port/videoChatManagerRepositoryPort';
const NEXT_PUBLIC_API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export const createVideoChatManagerRepositoryAdapter = (): VideoChatManagerRepositoryPort => {
  return {
    getToken: async (): Promise<TokenVideoChatManager> => {
      if (!NEXT_PUBLIC_API_TOKEN) {
        throw new Error("API token is not defined")
      }

      try {
        const response = await fetch(
          "https://api.heygen.com/v1/streaming.create_token",
          {
            method: "POST",
            headers: {
              "x-api-key": NEXT_PUBLIC_API_TOKEN,
              "content-type": "application/json",
            },
            body: JSON.stringify({}),
          }
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`)
        }
        const data = await response.json()

        return {token: data.data.token}
      } catch (error: any) {
        console.error(error)
        return {token: ""}
      }
    }
  }
}