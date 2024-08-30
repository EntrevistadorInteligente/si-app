import { VideoChatManagerRepositoryPort } from '../../domain/port/videoChatManagerRepositoryPort';

export const createVideoChatManagerService = (videoChatManagerRepositoryPort: VideoChatManagerRepositoryPort) => {
  return {
    getToken: async () => {
      return videoChatManagerRepositoryPort.getToken();
    }
  }
}