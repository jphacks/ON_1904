export interface GetAccessTokenResponse {
  access_token: string;
}

export interface GetSetlistSongsResponse {
  items: [
    {
      track: {
        name: string;
      };
    }
  ];
}
