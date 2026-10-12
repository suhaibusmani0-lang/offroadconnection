export function formatImageUrl(path?: string | null): string {
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return '/assets/images/resource/Wheel-1.png';
  }

  const trimmed = path.trim();

  // If already absolute URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Remove leading slashes
  const clean = trimmed.replace(/^\/+/, '');

  if (clean.startsWith('assets/')) {
    return `/${clean}`;
  }

  return `/assets/${clean}`;
}

