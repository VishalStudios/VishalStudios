export function getOptimizedCloudinaryUrl(url?: string | null, mediaType: 'image' | 'video' = 'image') {
    if (!url || !url.includes('/upload/')) {
        return url || '';
    }

    const transformation =
        mediaType === 'video'
            ? 'f_auto,q_auto:good,vc_auto,br_1200k,w_1280'
            : 'f_auto,q_auto:good,w_1600';

    return url.replace('/upload/', `/upload/${transformation}/`);
}
