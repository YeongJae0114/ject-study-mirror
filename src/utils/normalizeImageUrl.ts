const URL_WITH_PROTOCOL_PATTERN = /^(https?:|blob:|data:)/;

export function normalizeImageUrl(url?: string | null): string | null {
  if (!url) return null;

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return null;

  if (URL_WITH_PROTOCOL_PATTERN.test(trimmedUrl) || trimmedUrl.startsWith("/")) {
    return trimmedUrl;
  }

  if (trimmedUrl.startsWith("//")) {
    return `https:${trimmedUrl}`;
  }

  return `https://${trimmedUrl}`;
}
