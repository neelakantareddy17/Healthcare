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

export type EstimateSource = 'ml' | 'fallback';

export interface WaitTimeEstimate {
  minutes: number;
  source: EstimateSource;
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
): Promise<WaitTimeEstimate> => {
  try {
    const url = getPredictionUrl();
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
      return {
        minutes: getFallbackEstimate(input),
        source: 'fallback',
      };
    }

    let parsedResponse: unknown;
    try {
      parsedResponse = JSON.parse(responseBody) as unknown;
    } catch {
      console.error('[ML] Invalid JSON returned by prediction service');
      return {
        minutes: getFallbackEstimate(input),
        source: 'fallback',
      };
    }

    if (!isPredictionResponse(parsedResponse)) {
      console.error('[ML] Invalid prediction response shape');
      return {
        minutes: getFallbackEstimate(input),
        source: 'fallback',
      };
    }

    const result = parsedResponse;
    const prediction = result.predicted_wait_time_minutes;
    if (
      typeof prediction !== 'number' ||
      !Number.isFinite(prediction) ||
      prediction < 0
    ) {
      console.error('[ML] Invalid prediction response');
      return {
        minutes: getFallbackEstimate(input),
        source: 'fallback',
      };
    }

    return { minutes: prediction, source: 'ml' };
  } catch (error) {
    console.error('[ML] Prediction service connection failed', {
      reason: error instanceof Error ? error.name : 'UnknownError',
    });
    return {
      minutes: getFallbackEstimate(input),
      source: 'fallback',
    };
  }
};

const getFallbackEstimate = (input: WaitTimePredictionInput): number => {
  const minutes = Math.max(
    0,
    Math.round(
      input.patients_ahead * input.doctor_avg_consultation_time,
    ),
  );

  console.info('[ML] Using queue-based fallback estimate', {
    patientsAhead: input.patients_ahead,
    averageConsultationMinutes: input.doctor_avg_consultation_time,
    estimatedMinutes: minutes,
  });

  return minutes;
};
