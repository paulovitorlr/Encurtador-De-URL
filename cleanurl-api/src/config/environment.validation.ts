export function validateEnvironment(
  environment: Record<string, unknown>,
): Record<string, unknown> {
  const shortUrlBaseUrl = environment.SHORT_URL_BASE_URL;

  if (typeof shortUrlBaseUrl !== 'string' || !shortUrlBaseUrl.trim()) {
    throw new Error(
      'A variável de ambiente SHORT_URL_BASE_URL é obrigatória.',
    );
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(shortUrlBaseUrl);
  } catch {
    throw new Error(
      'A variável SHORT_URL_BASE_URL deve conter uma URL válida.',
    );
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new Error(
      'A variável SHORT_URL_BASE_URL deve utilizar HTTP ou HTTPS.',
    );
  }

  return {
    ...environment,
    SHORT_URL_BASE_URL: shortUrlBaseUrl.replace(/\/+$/, ''),
  };
}