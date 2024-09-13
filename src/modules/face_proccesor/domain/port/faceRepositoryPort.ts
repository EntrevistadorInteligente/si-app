import { FaceData } from '@/modules/face_proccesor/domain/model/faceData'

export interface FaceRepositoryPort {
  save: (faceData: FaceData[]) => Promise<void>;
}