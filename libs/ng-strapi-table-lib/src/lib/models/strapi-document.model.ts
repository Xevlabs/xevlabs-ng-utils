import { StrapiBaseResponseModel } from './strapi-base-response.model'

export type StrapiDocumentModel<T = {}> = T & {
    id: number
    documentId: string
}

export interface StrapiFindResponseModel<T> extends StrapiBaseResponseModel {
    data: StrapiDocumentModel<T>[]
}
