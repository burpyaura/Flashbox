export const TMDB_KEY = "9e38d1ffc33df9e31544cdcaf6ccabba";
export const TMDB_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500";

export type MediaType = "movie" | "tv";
export type TmdbItem = {
  id: number;
  media_type?: MediaType;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  origin_country?: string[];
  runtime?: number;
  genres?: { id: number; name: string }[];
  imdb_id?: string | null;
  external_ids?: { imdb_id?: string | null };
};

type TmdbResponse = { results: TmdbItem[] };

export const imageUrl = (path?: string | null, size = TMDB_IMAGE) => path ? `${size}${path}` : null;
export const itemType = (item: TmdbItem): MediaType => item.media_type ?? (item.first_air_date ? "tv" : "movie");
export const itemTitle = (item: TmdbItem) => item.title ?? item.name ?? "Untitled";
export const itemYear = (item: TmdbItem) => (item.release_date ?? item.first_air_date ?? "").slice(0, 4);
export const itemRuntime = (item: TmdbItem) => item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m` : itemType(item) === "tv" ? "TV Series" : "Movie";

async function tmdb<T>(path: string): Promise<T> {
  const response = await fetch(`${TMDB_BASE}${path}${path.includes("?") ? "&" : "?"}api_key=${TMDB_KEY}`);
  if (!response.ok) throw new Error(`TMDB request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const getTrending = () => tmdb<TmdbResponse>("/trending/all/day");
export const getPopularMovies = (page = 1) => tmdb<TmdbResponse>(`/movie/popular?page=${page}`);
export const getTopRatedMovies = (page = 1) => tmdb<TmdbResponse>(`/movie/top_rated?page=${page}`);
export const getPopularTv = (page = 1) => tmdb<TmdbResponse>(`/tv/popular?page=${page}`);
export const getAnime = (page = 1) => tmdb<TmdbResponse>(`/discover/tv?with_genres=16&sort_by=popularity.desc&page=${page}`);
export const getBollywood = (page = 1) => tmdb<TmdbResponse>(`/discover/movie?with_original_language=hi&region=IN&sort_by=popularity.desc&page=${page}`);
export const getDetails = (id: number, type: MediaType) => tmdb<TmdbItem>(`/${type}/${id}?append_to_response=external_ids`);
export const searchTmdb = (query: string) => tmdb<TmdbResponse>(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false&page=1`);
