import { MediaAsset, PexelsVideoSearchResponse } from '../types';

if (!process.env.PEXELS_API_KEY) {
  console.warn("PEXELS_API_KEY environment variable not set. Using mock video responses.");
}

const PEXELS_API_BASE_URL = 'https://api.pexels.com/videos';

const mockPexelsMedia: MediaAsset[] = [
    {
        id: `mock-pexels-1`,
        name: `For Bigger Blazes`,
        type: 'video',
        src: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4`,
        thumbnail: `https://picsum.photos/seed/pexels1/400/225`,
        duration: 15,
    },
    {
        id: `mock-pexels-2`,
        name: `Elephants Dream`,
        type: 'video',
        src: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4`,
        thumbnail: `https://picsum.photos/seed/pexels2/400/225`,
        duration: 653,
    },
    {
        id: `mock-pexels-3`,
        name: `For Bigger Fun`,
        type: 'video',
        src: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4`,
        thumbnail: `https://picsum.photos/seed/pexels3/400/225`,
        duration: 60,
    },
    {
        id: `mock-pexels-4`,
        name: `For Bigger Joyrides`,
        type: 'video',
        src: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4`,
        thumbnail: `https://picsum.photos/seed/pexels4/400/225`,
        duration: 15,
    },
    {
        id: `mock-pexels-5`,
        name: `Big Buck Bunny`,
        type: 'video',
        src: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
        thumbnail: `https://picsum.photos/seed/pexels5/400/225`,
        duration: 596,
    }
];


export const searchPexelsVideos = async (
  keyword: string,
  count: number = 5
): Promise<MediaAsset[]> => {
  if (!process.env.PEXELS_API_KEY) {
    // Return a shuffled and sliced version of the mock data to make it seem more dynamic
    return [...mockPexelsMedia].sort(() => 0.5 - Math.random()).slice(0, count);
  }

  const url = `${PEXELS_API_BASE_URL}/search?query=${encodeURIComponent(keyword)}&per_page=${count}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
       const errorBody = await response.text();
       console.error(`Pexels API error: ${response.status} ${response.statusText}`, errorBody);
       throw new Error(`Gagal mengambil media dari Pexels (Status: ${response.status}). Periksa kunci API Pexels Anda.`);
    }

    const data: PexelsVideoSearchResponse = await response.json();

    if (!data.videos || data.videos.length === 0) {
      return []; // Return empty if no results found
    }

    return data.videos.map(video => {
      // Find a standard definition MP4 file if possible
      const videoFile = video.video_files.find(f => f.quality === 'sd' && f.file_type.includes('mp4')) || video.video_files[0];
      const thumbnail = video.video_pictures.find(p => p.picture) || { picture: video.image };

      return {
        id: `pexels-${video.id}`,
        name: `Pexels video by ${video.user.name}`,
        type: 'video',
        src: videoFile.link,
        thumbnail: thumbnail.picture,
        duration: video.duration,
      };
    });
  } catch (error) {
    console.error("Failed to fetch from Pexels API:", error);
    // Re-throw a generic but user-friendly error
    if (error instanceof Error && error.message.includes('Pexels')) {
        throw error;
    }
    throw new Error('Tidak dapat terhubung ke layanan media Pexels. Periksa koneksi internet Anda.');
  }
};