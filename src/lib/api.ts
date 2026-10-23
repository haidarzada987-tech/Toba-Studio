export async function readJsonResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const preview = text.replace(/\s+/g, ' ').trim().slice(0, 180);
    throw new Error(
      `Expected JSON but received ${contentType || 'unknown content type'}${preview ? `: ${preview}` : ''}`
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Server returned invalid JSON.');
  }
}

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    headers: {
      Accept: 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  const data = await readJsonResponse<T>(response);

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'error' in (data as Record<string, unknown>)
        ? String((data as Record<string, unknown>).error)
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}
