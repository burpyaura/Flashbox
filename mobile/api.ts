export type MediaType = "movie" | "tv";
export type Item = { id: number; media_type?: MediaType; title?: string; name?: string; overview?: string; poster_path?: string | null; release_date?: string; first_air_date?: string; vote_average?: number; number_of_seasons?: number };
export type Episode = { id: number; episode_number: number; name: string; overview?: string; still_path?: string | null; air_date?: string; runtime?: number; vote_average?: number };
export type Selection = { id: number; type: MediaType; season?: number; episode?: number };
export const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_API = process.env.EXPO_PUBLIC_TMDB_API_URL ?? "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY ?? "";

export const itemTitle = (item: Item) => item.title ?? item.name ?? "Untitled";
export const itemType = (item: Item): MediaType => item.media_type === "tv" || Boolean(item.first_air_date) ? "tv" : "movie";
export const itemYear = (item: Item) => (item.release_date ?? item.first_air_date ?? "").slice(0, 4);

export async function tmdb<T>(path: string): Promise<T> {
  const response = await fetch(`${TMDB_API}${path}${path.includes("?") ? "&" : "?"}api_key=${TMDB_KEY}`);
  if (!response.ok) throw new Error(`TMDB request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const getSeason = (showId: number, season: number) => tmdb<{ episodes: Episode[] }>(`/tv/${showId}/season/${season}`);
