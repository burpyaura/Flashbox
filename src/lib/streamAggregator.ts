import { MediaType } from "./tmdb";

export type StreamSource = { id: number; name: string; url: string };

export async function fetchMovieStreams(
  tmdbId: number, 
    mediaType: MediaType, 
      season = 1, 
        episode = 1
        ): Promise<StreamSource[]> {
          
            const path = mediaType === "tv" 
                ? `tv/${tmdbId}/${season}/${episode}` 
                    : `movie/${tmdbId}`;

                      return [
                          {
                                id: 1,
                                      name: "Server 1 (VidSrc)",
                                            url: `https://vidsrc.cc/v2/embed/${path}`
                                                },
                                                    {
                                                          id: 2,
                                                                name: "Server 2 (VidSrc Pro)",
                                                                      url: `https://vidsrc.pro/embed/${path}`
                                                                          },
                                                                              {
                                                                                    id: 3,
                                                                                          name: "Server 3 (2Embed)",
                                                                                                url: `https://www.2embed.cc/embed/${path}`
                                                                                                    }
                                                                                                      ];
    