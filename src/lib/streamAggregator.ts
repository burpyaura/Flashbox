import { MediaType } from "./tmdb";

export type StreamSource = { id: number; name: string; url: string };
type StreamContext = { tmdbId: number; mediaType: MediaType; season?: number; episode?: number };

const providerBase = {
  internal: process.env.NEXT_PUBLIC_STREAM_NODE_1 ?? "/api/streams/primary",
  customApi: process.env.NEXT_PUBLIC_STREAM_API_URL ?? "",
  fallback: process.env.NEXT_PUBLIC_STREAM_NODE_3 ?? "/api/streams/fallback",
};

const pathFor = ({ tmdbId, mediaType, season = 1, episode = 1 }: StreamContext) => mediaType === "tv"
  ? `${mediaType}/${tmdbId}/${season}/${episode}`
  : `${mediaType}/${tmdbId}`;

const providerRegistry = {
  internal: (context: StreamContext): StreamSource => ({ id: 1, name: "Server 1 (Auto-Aggregated)", url: `${providerBase.internal.replace(/\/$/, "")}/${pathFor(context)}` }),
  customApi: async (context: StreamContext): Promise<StreamSource | null> => {
    if (!providerBase.customApi) return null;
    try {
      const response = await fetch(`${providerBase.customApi.replace(/\/$/, "")}/${pathFor(context)}`);
      if (!response.ok) return null;
      const data = await response.json() as { url?: unknown; name?: unknown };
      return typeof data.url === "string" && data.url ? { id: 2, name: typeof data.name === "string" ? data.name : "Server 2 (Custom Gateway)", url: data.url } : null;
    } catch {
      return null;
    }
  },
  fallback: (context: StreamContext): StreamSource => ({ id: 3, name: "Server 3 (Fallback Stream)", url: `${providerBase.fallback.replace(/\/$/, "")}/${pathFor(context)}` }),
};

export async function fetchMovieStreams(tmdbId: number, mediaType: MediaType, season = 1, episode = 1): Promise<StreamSource[]> {
  const context = { tmdbId, mediaType, season, episode };
  const customSource = await providerRegistry.customApi(context);
  return [providerRegistry.internal(context), ...(customSource ? [customSource] : []), providerRegistry.fallback(context)];
}
