const URL_WITH_PROTOCOL_PATTERN = /^(https?:|blob:|data:)/;
const LOCAL_HTTP_PATTERN = /^http:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/;

export function normalizeImageUrl(url?: string | null): string | null {
  if (!url) return null;

  let trimmedUrl = url.trim().replace(/^["']|["']$/g, "");
  if (!trimmedUrl.startsWith("data:")) {
    trimmedUrl = trimmedUrl.replace(/\|+$/g, "");
  }
  if (!trimmedUrl) return null;

  if (trimmedUrl.startsWith("http://") && !LOCAL_HTTP_PATTERN.test(trimmedUrl)) {
    return `https://${trimmedUrl.slice("http://".length)}`;
  }

  if (URL_WITH_PROTOCOL_PATTERN.test(trimmedUrl) || trimmedUrl.startsWith("/")) {
    return trimmedUrl;
  }

  if (trimmedUrl.startsWith("//")) {
    return `https:${trimmedUrl}`;
  }

  return `https://${trimmedUrl}`;
}
