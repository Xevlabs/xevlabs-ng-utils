export interface ServerErrorModel {
  status: number,
  name?: string, 
  message: string, 
  details?: {
    key: string
  }
}