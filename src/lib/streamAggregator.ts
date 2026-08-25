import { MediaType } from "./tmdb";

export type StreamSource = { id: number; name: string; url: string };

const RENDER_BACKEND_URL = "https://shadowplay-backend-wgyg.onrender.com";

export async function fetchMovieStreams(
  tmdbId: number, 
    mediaType: MediaType, 
      season = 1, 
        episode = 1
        ): Promise<StreamSource[]> {
          try {
              const response = await fetch(
                    `${RENDER_BACKEND_URL}/api/stream?tmdbId=${tmdbId}&type=${mediaType}&season=${season}&episode=${episode}`
                        );

                            if (!response.ok) {
                                  throw new Error("Backend response error");
                                      }

                                          const data = await response.json();

                                              const sources: StreamSource[] = [];

                                                  // Primary fast stream url from Render
                                                      if (data.primaryStreamUrl) {
                                                            sources.push({
                                                                    id: 1,
                                                                            name: "Auto Player",
                                                                                    url: data.primaryStreamUrl,
                                                                                          });
                                                                                              }

                                                                                                  // Fallback streams
                                                                                                      if (Array.isArray(data.fallbacks)) {
                                                                                                            data.fallbacks.forEach((url: string, index: number) => {
                                                                                                                    sources.push({
                                                                                                                              id: index + 2,
                                                                                                                                        name: `Backup Server ${index + 1}`,
                                                                                                                                                  url: url,
                                                                                                                                                          });
                                                                                                                                                                });
                                                                                                                                                                    }

                                                                                                                                                                        return sources;
                                                                                                                                                                          } catch (error) {
                                                                                                                                                                              console.error("Failed to fetch streams from backend, applying fallback:", error);
                                                                                                                                                                                  
                                                                                                                                                                                      // Direct fallback if Render service is waking up
                                                                                                                                                                                          const fallbackUrl = mediaType === "tv"
                                                                                                                                                                                                ? `https://vidsrc.pro/embed/tv/${tmdbId}/${season}/${episode}`
                                                                                                                                                                                                      : `https://vidsrc.pro/embed/movie/${tmdbId}`;

                                                                                                                                                                                                          return [
                                                                                                                                                                                                                {
                                                                                                                                                                                                                        id: 1,
                                                                                                                                                                                                                                name: "Auto Player",
                                                                                                                                                                                                                                        url: fallbackUrl,
                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                  ];
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                    