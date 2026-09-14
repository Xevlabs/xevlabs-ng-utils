export interface TableLibOptionsModel {
  baseUrl: string;
  /**
   * Target Strapi major version. Defaults to 4.
   * With 5, entries are expected in the flattened v5 format
   * ({ id, documentId, ...fields }) and drafts are requested via status=draft.
   */
  strapiVersion?: 4 | 5;
}
