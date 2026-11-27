const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' };

export function sendJson(res, status, payload, extraHeaders = {}) {
  res.writeHead(status, { ...JSON_HEADERS, ...extraHeaders });
  res.end(JSON.stringify(payload));
}

export function errorBody(status, error, message, details) {
  const body = {
    timestamp: new Date().toISOString(),
    status,
    error,
    message,
  };

  if (details !== undefined) {
    body.details = details;
  }

  return body;
}

export function sendError(res, status, error, message, details, extraHeaders = {}) {
  sendJson(res, status, errorBody(status, error, message, details), extraHeaders);
}
