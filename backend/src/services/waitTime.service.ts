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
    const response = await fetch(`${env.mlServiceUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) return null;
    const result = (await response.json()) as {
      predicted_wait_time_minutes?: unknown;
    };
    return typeof result.predicted_wait_time_minutes === 'number' &&
      Number.isFinite(result.predicted_wait_time_minutes) &&
      result.predicted_wait_time_minutes >= 0
      ? result.predicted_wait_time_minutes
      : null;
  } catch {
    return null;
  }
};