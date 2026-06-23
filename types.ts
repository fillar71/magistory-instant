export interface User {
  name: string;
  email: string;
  credits: number;
  avatarUrl: string;
}

export type Page = 'landing' | 'text-to-video' | 'editor' | 'pricing' | 'support';

export interface VideoScriptScene {
  scene: number;
  visual: string;
  narration: string;
  stock_keyword: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: 'video' | 'image';
  src: string;
  thumbnail: string;
  duration?: number;
}

export interface TimelineClip {
    id: string;
    assetId: string;
    track: 'video' | 'audio' | 'text';
    start: number;
    end: number;
    layer: number;
}

// --- Pexels API Types ---

export interface VideoPicture {
  id: number;
  picture: string;
  nr: number;
}

export interface VideoFile {
  id: number;
  quality: 'sd' | 'hd';
  file_type: string;
  width: number;
  height: number;
  link: string;
}

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string; // This is a thumbnail URL
  duration: number;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: VideoFile[];
  video_pictures: VideoPicture[];
}

export interface PexelsVideoSearchResponse {
  page: number;
  per_page: number;
  total_results: number;
  url: string;
  videos: PexelsVideo[];
}
