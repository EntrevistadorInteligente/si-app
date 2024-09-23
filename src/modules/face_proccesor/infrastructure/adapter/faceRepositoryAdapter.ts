import { FaceRepositoryPort } from '@/modules/face_proccesor/domain/port/faceRepositoryPort'
import { processFaceData } from '@/modules/face_proccesor/application/usecases/processFaceData'

export const createFaceRepositoryAdapter = (): FaceRepositoryPort => {
  return {
    save: async faceData => {
      const aggregatedData = processFaceData(faceData)
      console.log('AggregatedData', aggregatedData)
      // call the api to save the data
    }
  }
}