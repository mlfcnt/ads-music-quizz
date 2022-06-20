//TODO purify

import { playlists } from "../playlists";

//TODO
type Playlist = {
  tracks: {
    items: Item[];
  };
};

type Item = {
  track: Track;
};
export type Track = {
  album: any;
  artists: Artist[];
  id: string;
  name: string;
  popularity: number;
  uri: string;
};

export type Artist = {
  id: string;
  name: string;
};

// https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/
// https://leerob.io/blog/spotify-api-nextjs

const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://ads-music-quizz.vercel.app/";

export const requestAccessToken = async () => {
  const SPOTIFY_TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
  if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    throw new Error("CLIENT_ID and CLIENT_SECRET must be set");
  }
  const basicAuth = Buffer.from(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
  ).toString("base64");

  try {
    const res = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    });
    const { access_token: accessToken } = await res.json();
    if (!accessToken || typeof accessToken !== "string") {
      throw new Error("Error while getting access token");
    }
    return accessToken;
  } catch (error) {
    console.log(1, error);
    throw error;
  }
};

export const getPlaylist = async () => {
  const url = "https://api.spotify.com/v1/playlists";
  const accessToken = await requestAccessToken();

  const randomPlaylistId =
    playlists[Math.floor(Math.random() * playlists.length)].id;

  const res = await fetch(url + `/${randomPlaylistId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.json();
};

export const getArtistFromPlaylist = (playlist: Playlist): Artist | null => {
  if (!playlist.tracks) return null;
  const randomTrackIndex = Math.floor(
    Math.random() * playlist.tracks.items.length
  );
  return playlist.tracks.items[randomTrackIndex].track.artists[0];
};

export const getTopTacksFromArtist = async (
  artistId: string
): Promise<Track[]> => {
  const url = "https://api.spotify.com/v1/artists";
  const accessToken = await requestAccessToken();
  const res = await fetch(
    `${url}/${artistId}/top-tracks?` +
      new URLSearchParams({
        market: "FR",
      }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const { tracks } = await res.json();
  return tracks;
};

export const getArtistOfTheDay = async () => {
  const res = await fetch(`${baseUrl}/api/artist-of-the-day`);

  const artistOfTheDay = await res.json();
  return artistOfTheDay;
};

export const searchArtistsByName = async (name: string) => {
  if (!name?.length) return;
  const res = await fetch(
    `/api?${new URLSearchParams({
      name,
    })}`
  );

  const artists = await res.json();
  return artists;
};
