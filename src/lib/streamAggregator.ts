import { MediaType } from "./tmdb";

export type StreamSource = { id: number; name: string; url: string };

const nodes = [
  process.env.NEXT_PUBLIC_STREAM_NODE_1,
  process.env.NEXT_PUBLIC_STREAM_NODE_2,
  process.env.NEXT_PUBLIC_STREAM_NODE_3,
].filter((node): node is string => Boolean(node));

export async function fetchMovieStreams(tmdbId: number, mediaType: MediaType, season = 1, episode = 1): Promise<StreamSource[]> {
  const path = mediaType === "tv" ? `tv/${tmdbId}/${season}/${episode}` : `movie/${tmdbId}`;
  return nodes.map((baseUrl, index) => ({ id: index + 1, name: `Stream ${index + 1}`, url: `${baseUrl.replace(/\/$/, "")}/${path}` }));
}
