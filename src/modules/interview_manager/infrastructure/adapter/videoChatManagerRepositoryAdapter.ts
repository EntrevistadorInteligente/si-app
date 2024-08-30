import { TokenVideoChatManager } from '../../domain/model/videoChatManager';
import { VideoChatManagerRepositoryPort } from '../../domain/port/videoChatManagerRepositoryPort';
const api_token =  "MDdlYzkyNjljY2M2NDQyZjg1ZTAwYjQxMDQ2OWZkMGYtMTcyMjM5NzAxMA=="

export const createVideoChatManagerRepositoryAdapter = (): VideoChatManagerRepositoryPort => {
  return {
    getToken: async (): Promise<TokenVideoChatManager> => {
      if (!api_token) {
        throw new Error("API token is not defined")
      }

      try {
        const response = await fetch(
          "https://api.heygen.com/v1/streaming.create_token",
          {
            method: "POST",
            headers: {
              "x-api-key": api_token,
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