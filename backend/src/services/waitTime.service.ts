
import { env } from '../config/env.js';

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

export const predictWaitTime = async (
  input: WaitTimePredictionInput,
): Promise<number | null> => {
  try {
    const url = `${env.mlServiceUrl}/predict`;

    console.info('[ML] Sending prediction request');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(3000),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      console.error('[ML] Prediction request failed', {
        status: response.status,
        body: responseBody,
      });

      return null;
    }

    let result: {
      predicted_wait_time_minutes?: unknown;
    };

    try {
      result = JSON.parse(responseBody);
    } catch {
      console.error('[ML] Invalid JSON returned by ML service');
      return null;
    }

    const prediction = result.predicted_wait_time_minutes;

    if (
      typeof prediction !== 'number' ||
      !Number.isFinite(prediction) ||
      prediction < 0
    ) {
      console.error('[ML] Invalid prediction response', result);
      return null;
    }

    console.info('[ML] Prediction received successfully', {
      predicted_wait_time_minutes: prediction,
    });

    return prediction;
  } catch (error) {
    console.error('[ML] Prediction service connection failed', {
      error:
        error instanceof Error
          ? `${error.name}: ${error.message}`
          : String(error),
    });

    return null;
  }
};
