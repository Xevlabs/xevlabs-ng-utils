export interface ServerErrorModel {
  statusCode: number,
  error: string,
  message: string,
  data: {
    key: string;
    message: string;
  }
}
