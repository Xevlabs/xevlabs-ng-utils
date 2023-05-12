import { StrapiBaseResponseDataModel } from "./strapi-base-response-data.model";
import { StrapiBaseResponseModel } from "./strapi-base-response.model";

export interface StrapiFindModel<T> extends StrapiBaseResponseModel {
    data: StrapiBaseResponseDataModel<T>[]
}
