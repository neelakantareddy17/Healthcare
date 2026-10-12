import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export interface WaitTimePredictionInput {
  doctor_id: string;
  department: string;
  appointment_date: string;
  appointment_hour: number;
  day_of_week: string;
  is_weekend: number;
  appointment_type: string;
  patients_ahead: number;
  queue_length: number;
  current_token: number;
  patient_token: number;
  doctor_status: string;
  doctor_avg_consultation_time: number;
  check_in_delay_minutes: number;
}

interface WaitTimePredictionResponse {
  predicted_wait_time_minutes?: unknown;
}

const isPredictionResponse = (
  value: unknown,
): value is WaitTimePredictionResponse =>
  typeof value === 'object' && value !== null;

const getPredictionUrl = (): string => {
  let serviceUrl: URL;

  try {
    serviceUrl = new URL(env.mlServiceUrl);
  } catch {
    throw ApiError.internal('Wait-time prediction service is unavailable');
  }

  if (!['http:', 'https:'].includes(serviceUrl.protocol)) {
    throw ApiError.internal('Wait-time prediction service is unavailable');
  }

  if (serviceUrl.pathname !== '/' && serviceUrl.pathname !== '') {
    throw ApiError.internal('Wait-time prediction service is unavailable');
  }

  return new URL('/predict', serviceUrl).toString();
};

export const predictWaitTime = async (
  input: WaitTimePredictionInput,
): Promise<number> => {
  const url = getPredictionUrl();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(3000),
    });
    const responseBody = await response.text();

    if (!response.ok) {
      console.error('[ML] Prediction request failed', {
        status: response.status,
      });
      throw ApiError.internal('Wait-time prediction is currently unavailable');
    }

    let parsedResponse: unknown;
    try {
      parsedResponse = JSON.parse(responseBody) as unknown;
    } catch {
      console.error('[ML] Invalid JSON returned by prediction service');
      throw ApiError.internal('Wait-time prediction is currently unavailable');
    }

    if (!isPredictionResponse(parsedResponse)) {
      console.error('[ML] Invalid prediction response shape');
      throw ApiError.internal('Wait-time prediction is currently unavailable');
    }

    const result = parsedResponse;
    const prediction = result.predicted_wait_time_minutes;
    if (
      typeof prediction !== 'number' ||
      !Number.isFinite(prediction) ||
      prediction < 0
    ) {
      console.error('[ML] Invalid prediction response');
      throw ApiError.internal('Wait-time prediction is currently unavailable');
    }

    return prediction;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error('[ML] Prediction service connection failed', {
      error:
        error instanceof Error
          ? `${error.name}: ${error.message}`
          : String(error),
    });
    throw ApiError.internal('Wait-time prediction is currently unavailable');
  }
};
