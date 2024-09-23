import * as faceapi from 'face-api.js'
import { FaceData } from '@/modules/face_proccesor/domain/model/faceData'

type AggregatedData = {
  expressions: { [key in keyof faceapi.FaceExpressions]?: number };
}

export const processFaceData = (faces: FaceData[]): AggregatedData => {
  const totalFrames = faces.length

  if (totalFrames === 0) {
    return { expressions: {} }
  }

  const initialExpressions: AggregatedData['expressions'] = {}

  const aggregatedData: AggregatedData = faces.reduce((acc, frame) => {
    const expressions = frame.expressions

    Object.keys(expressions)
      .forEach(key => {
        const expressionKey   = key as keyof faceapi.FaceExpressions
        const expressionValue = expressions[expressionKey]

        if (typeof expressionValue === 'number') {
          acc.expressions[expressionKey] = (acc.expressions[expressionKey] || 0) + expressionValue
        }
      })

    return acc
  }, { expressions: initialExpressions })

  Object.keys(aggregatedData.expressions).forEach(key => {
    const expressionKey = key as keyof faceapi.FaceExpressions
    aggregatedData.expressions[expressionKey]! /= totalFrames
  })

  return aggregatedData
}