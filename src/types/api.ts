export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError<T extends Record<string, unknown> = Record<string, never>> = {
  success: false;
  error: {
    code: string;
    message: string;
  } & T;
};