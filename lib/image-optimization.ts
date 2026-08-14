/**
 * Image Optimization & Fast Fetch Helper
 * Converts raw/heavy image URLs to high-performance WebP formats with CDN compression based on admin settings.
 */

export type ImageQualityMode = 'ultra-fast' | 'balanced' | 'max-quality';

export function getOptimizedImageUrl(
  url?: string | null,
  mode: ImageQualityMode | string = 'balanced'
): string {
  if (!url) return '/placeholder-image.jpg';

  // Handle Unsplash Images
  if (url.includes('images.unsplash.com')) {
    const urlObj = new URL(url);
    switch (mode) {
      case 'ultra-fast':
        urlObj.searchParams.set('auto', 'format,compress');
        urlObj.searchParams.set('q', '75');
        urlObj.searchParams.set('fit', 'crop');
        break;
      case 'max-quality':
        urlObj.searchParams.set('auto', 'format');
        urlObj.searchParams.set('q', '98');
        urlObj.searchParams.set('fit', 'crop');
        break;
      case 'balanced':
      default:
        urlObj.searchParams.set('auto', 'format,compress');
        urlObj.searchParams.set('q', '88');
        urlObj.searchParams.set('fit', 'crop');
        break;
    }
    return urlObj.toString();
  }

  // Handle Cloudinary Images
  if (url.includes('res.cloudinary.com')) {
    if (mode === 'ultra-fast') {
      return url.replace('/upload/', '/upload/f_auto,q_auto:eco/');
    } else if (mode === 'max-quality') {
      return url.replace('/upload/', '/upload/f_auto,q_auto:best/');
    } else {
      return url.replace('/upload/', '/upload/f_auto,q_auto:good/');
    }
  }

  // Fallback default
  return url;
}
