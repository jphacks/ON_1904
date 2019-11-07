import request from 'request';
import httpRequest from './httpRequest';
import accessDb from './accessDb';
import { GetAccessTokenResponse, GetSetlistSongsResponse } from '../models/spotifyModel';

const { SPOTIFY_TOKEN } = process.env;

const getAccessToken = async (): Promise<string> => {
  const options = {
    uri: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization: `Basic ${SPOTIFY_TOKEN}`,
    },
    form: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      grant_type: 'client_credentials',
    },
  };
  const res: GetAccessTokenResponse = await httpRequest.post(options);
  const spotifyAccessToken = res.access_token;
  return spotifyAccessToken;
};

const getSetlistSongs = async (userId: string, spotifyAccessToken: string, playlistId: string):
  Promise<Array<string>> => {
  const options: request.Options = {
    uri: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    headers: {
      Authorization: `Bearer ${spotifyAccessToken}`,
    },
  };
  console.log({ spotifyAccessToken });
  const res: GetSetlistSongsResponse = await httpRequest.get(options);

  console.log({ res });

  const songs = [];
  res.items.forEach((song) => {
    console.log(`name : ${song.track.name}`);
    songs.push(song.track.name);
  });

  return songs;
};

export default {
  getAccessToken,
  getSetlistSongs,
};
