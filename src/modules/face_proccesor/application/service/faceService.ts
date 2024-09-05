import { FaceRepositoryPort } from '@/modules/face_proccesor/domain/port/faceRepositoryPort'
import { FaceData } from '@/modules/face_proccesor/domain/model/faceData'

export const createFaceService = (faceRepositoryPort: FaceRepositoryPort) => {
  return {
    save: async (faces: FaceData[]) => {
      await faceRepositoryPort.save(faces);
    }
  }
}