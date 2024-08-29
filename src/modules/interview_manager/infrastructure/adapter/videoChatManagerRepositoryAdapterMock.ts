import { createVideoChatManagerMock } from '../../domain/model/__mocks__/videoChatManagerMock';
import { TokenVideoChatManager } from '../../domain/model/videoChatManager';
import { VideoChatManagerRepositoryPort } from '../../domain/port/videoChatManagerRepositoryPort';

export const createVideoChatManagerRepositoryAdapterMock = (): VideoChatManagerRepositoryPort => {
  return {
    getToken: async (): Promise<TokenVideoChatManager> => {
      return createVideoChatManagerMock;
    }
  }
}