export interface IApiResponseCollection<T> {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
  },
  data: T[];
}

export interface IProcessResponse {
  ok: boolean;
  message: string;
}