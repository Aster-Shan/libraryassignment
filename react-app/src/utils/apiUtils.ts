import axios, { AxiosError } from 'axios';

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response) {
      return axiosError.response.data.message || 'An error occurred';
    }
  }
  return 'An unexpected error occurred';
};

