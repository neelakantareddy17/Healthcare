const getDetailMessage = (details) => {
  if (typeof details === 'string') return details;
  if (!Array.isArray(details)) return '';

  return details
    .map((detail) => (typeof detail === 'string' ? detail : detail?.message))
    .filter(Boolean)
    .join('. ');
};

export const getApiErrorMessage = (error, fallback) => {
  const responseData = error?.response?.data;
  return getDetailMessage(responseData?.details) || responseData?.message || fallback;
};