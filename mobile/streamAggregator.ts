import type { MediaType, Selection } from "./api";

export type StreamSource = { id: number; name: string; url: string };
const STREAM_API = process.env.EXPO_PUBLIC_STREAM_API_URL ?? "";

export async function fetchMovieStreams(selection: Selection): Promise<StreamSource[]> {
  if (!STREAM_API) return [];
  try {
    const response = await fetch(`${STREAM_API}?tmdbId=${selection.id}&type=${selection.type}`);
    if (!response.ok) return [];
    const data = await response.json() as { primaryStreamUrl?: unknown; fallbacks?: unknown };
    const urls = [data.primaryStreamUrl, ...(Array.isArray(data.fallbacks) ? data.fallbacks : [])];
    return urls.filter((url): url is string => typeof url === "string" && /^https?:\/\//i.test(url)).map((url, id) => ({ id, name: `Stream ${id + 1}`, url }));
  } catch {
    return [];
  }
}
