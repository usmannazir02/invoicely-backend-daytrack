import { Response } from 'express';

export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
}

/**
 * Generates a standardized API response
 * @param data - The response data
 * @param message - Success or error message
 * @param res - Express response object
 * @param code - HTTP status code (default: 200)
 * @returns Formatted JSON response
 */
export const generateResponse = <T = any>(
  data: T,
  message: string,
  res: Response,
  code: number = 200,
): Response<ApiResponse<T>> => {
  return res.status(code).json({
    statusCode: code,
    message,
    data,
  });
};
