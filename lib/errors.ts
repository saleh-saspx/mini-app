import axios from 'axios';

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      (typeof error.response?.data === 'string' ? error.response.data : null) ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error) return error.message;
  return fallback;
}
