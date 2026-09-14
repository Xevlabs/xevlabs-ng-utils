export interface StrapiBaseResponseDataModel<T> {
    id: number,
    attributes: T
}

// Strapi v5 entries come pre-flattened: the fields sit next to id/documentId
export type StrapiV5ResponseDataModel<T> = T & { id: number, documentId: string }

