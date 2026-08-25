import { MediaType } from "./tmdb";

export type StreamSource = { id: number; name: string; url: string };
type StreamResponse = { primaryStreamUrl?: unknown; fallbacks?: unknown };

const API_URL = "https://shadowplay-backend-wgyg.onrender.com/api/stream";

export async function fetchMovieStreams(tmdbId: number, mediaType: MediaType, season = 1, episode = 1): Promise<StreamSource[]> {
  try {
    const params = new URLSearchParams({ tmdbId: String(tmdbId), type: mediaType, season: String(season), episode: String(episode) });
    const response = await fetch(`${API_URL}?${params}`);
    if (!response.ok) return [];
    const data = await response.json() as StreamResponse;
    const urls = [data.primaryStreamUrl, ...(Array.isArray(data.fallbacks) ? data.fallbacks : [])];
    return urls.filter((url): url is string => typeof url === "string" && url.length > 0).map((url, index) => ({ id: index + 1, name: index ? `Backup Server ${index}` : "Auto Player", url }));
  } catch {
    return [];
  }
}
