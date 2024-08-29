import { TokenVideoChatManager } from "../model/videoChatManager";

export interface VideoChatManagerRepositoryPort {
  getToken: () => Promise<TokenVideoChatManager>;
}