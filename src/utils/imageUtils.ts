import { timelineData } from '../data/laneData/timelineData';

export const getThumbnailUrl = (imageUrl: string, size: number = 240) => {
  if (!imageUrl) return imageUrl;
  
  if (imageUrl.includes('upload.wikimedia.org')) {
    // Pattern: /thumb/.../.../NNNpx-filename or /.../.../filename
    const thumbMatch = imageUrl.match(/\/thumb\/(.+)\/(\d+px-.+)$/);
    if (thumbMatch) {
      // Already a thumbnail, replace the size
      const [, path, filename] = thumbMatch;
      const newFilename = filename.replace(/^\d+px-/, `${size}px-`);
      return `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/${newFilename}`;
    } else {
      // Original image, convert to thumbnail
      const pathMatch = imageUrl.match(/\/wikipedia\/commons\/(.+)$/);
      if (pathMatch) {
        const [, path] = pathMatch;
        const filename = path.split('/').pop();
        return `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/${size}px-${filename}`;
      }
    }
  }
  
  return imageUrl;
};

const getAllImageUrls = (): string[] => {
  const imageUrls = new Set<string>();
  
  timelineData.forEach(lane => {
    lane.items.forEach(item => {
      if (item.imageUrl) {
        const optimizedUrl = getThumbnailUrl(item.imageUrl, 240);
        imageUrls.add(optimizedUrl);
      }
    });
  });
  
  return Array.from(imageUrls);
};

// Use fetch with no-cors to cache images that block normal preloading
const preloadImageWithFetch = async (url: string): Promise<void> => {
  try {
    await fetch(url, { 
      mode: 'no-cors',
      cache: 'force-cache'
    });
  } catch (error) {
    console.warn(`❌ Fetch preload failed: ${url}`, error);
  }
};

// Triple-fallback strategy: crossOrigin -> no crossOrigin -> fetch with no-cors
const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      resolve();
    };
    
    img.onerror = async (error) => {
      if (img.crossOrigin) {
        const img2 = new Image();
        
        img2.onload = () => {
          resolve();
        };
        
        img2.onerror = async () => {
          await preloadImageWithFetch(url);
          resolve();
        };
        
        img2.src = url;
      } else {
        await preloadImageWithFetch(url);
        resolve();
      }
    };
    
    const isWikipedia = url.includes('wikimedia.org') || url.includes('wikipedia.org');
    if (isWikipedia) {
      img.crossOrigin = 'anonymous';
    }
    
    img.src = url;
  });
};

export const preloadAllImages = async (): Promise<void> => {
  const imageUrls = getAllImageUrls();
  const totalImages = imageUrls.length;
    
  let loadedCount = 0;
  const startTime = Date.now();
  
  const preloadPromises = imageUrls.map(async (url) => {
    await preloadImage(url);
    loadedCount++;
  });
  
  await Promise.all(preloadPromises);
  
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`🎉 Image preloading complete! ${totalImages} images processed in ${totalTime}s`);
};

export const preloadAllImagesBatched = async (batchSize: number = 5): Promise<void> => {
  const imageUrls = getAllImageUrls();
  const totalImages = imageUrls.length;
    
  let loadedCount = 0;
  const startTime = Date.now();
  
  for (let i = 0; i < imageUrls.length; i += batchSize) {
    const batch = imageUrls.slice(i, i + batchSize);
    
    await Promise.all(batch.map(async (url) => {
      await preloadImage(url);
      loadedCount++;
    }));
    
    const progress = Math.round((loadedCount / totalImages) * 100);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`📊 Batch complete: ${loadedCount}/${totalImages} (${progress}%) - ${elapsed}s elapsed`);
    
    // Small delay between batches to prevent overwhelming the browser
    if (i + batchSize < imageUrls.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`🎉 Batched image preloading complete! ${totalImages} images processed in ${totalTime}s`);
};

export const getImageStats = () => {
  const imageUrls = getAllImageUrls();
  const totalImages = imageUrls.length;
  
  const domainCounts: Record<string, number> = {};
  imageUrls.forEach(url => {
    try {
      const domain = new URL(url).hostname;
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    } catch (e) {
      domainCounts['invalid'] = (domainCounts['invalid'] || 0) + 1;
    }
  });
  
  return {
    totalImages,
    domainCounts,
    imageUrls
  };
}; 