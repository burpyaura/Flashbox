import { MediaType } from "./tmdb";

export type StreamSource = { id: number; name: string; url: string };
type StreamContext = { tmdbId: number; mediaType: MediaType; season?: number; episode?: number };

// Direct Domain Configurations
const STREAM_CONFIG = {
  // Yahan aap apne real domains paste kar sakte hain
    SERVER_1_BASE: "https://vidsrc.pro/embed",
      SERVER_2_BASE: "https://embed.smashystream.com/playere.php?tmdb=",
        SERVER_3_BASE: "https://www.2embed.cc/embed",
        };

        const formatPath = ({ tmdbId, mediaType, season = 1, episode = 1 }: StreamContext, serverType: number) => {
          if (serverType === 2) {
              // SmashyStream Query Format
                  return mediaType === "tv" 
                        ? `${tmdbId}&s=${season}&e=${episode}` 
                              : `${tmdbId}`;
                                }

                                  // Standard Path Format (VidSrc / 2Embed)
                                    return mediaType === "tv"
                                        ? `tv/${tmdbId}/${season}/${episode}`
                                            : `movie/${tmdbId}`;
                                            };

                                            const providerRegistry = {
                                              server1: (context: StreamContext): StreamSource => ({
                                                  id: 1,
                                                      name: "Server 1",
                                                          url: `${STREAM_CONFIG.SERVER_1_BASE}/${formatPath(context, 1)}`
                                                            }),
                                                              server2: (context: StreamContext): StreamSource => ({
                                                                  id: 2,
                                                                      name: "Server 2",
                                                                          url: `${STREAM_CONFIG.SERVER_2_BASE}${formatPath(context, 2)}`
                                                                            }),
                                                                              server3: (context: StreamContext): StreamSource => ({
                                                                                  id: 3,
                                                                                      name: "Server 3",
                                                                                          url: `${STREAM_CONFIG.SERVER_3_BASE}/${formatPath(context, 3)}`
                                                                                            }),
                                                                                            };

                                                                                            export async function fetchMovieStreams(tmdbId: number, mediaType: MediaType, season = 1, episode = 1): Promise<StreamSource[]> {
                                                                                              const context = { tmdbId, mediaType, season, episode };
                                                                                                
                                                                                                  // Directly returns the array of valid direct streaming URLs
                                                                                                    return [
                                                                                                        providerRegistry.server1(context),
                                                                                                            providerRegistry.server2(context),
                                                                                                                providerRegistry.server3(context)
                                                                                                                  ];
                                                                                                                  }
                                                                                                                  