export const successResponse = (message: string, data: any = null) => ({
  status: 'success',
  message,
  data,
});

export const errorResponse = (message: string, error: any = null) => ({
  status: 'error',
  message,
  error,
});
