import type { RideHistoryResponse } from 'types/RideHistoryResponse';

export const getSingleRidePage = async (
  accessToken: string,
  page: number
): Promise<RideHistoryResponse[]> => {
  const url = `https://tap33.me/api/v2/ride/history/10/${page}`;

  return await fetch(url, {
    credentials: 'omit',
    headers: {
      'User-Agent': navigator.userAgent,
      Accept: '*/*',
      'Accept-Language': 'en-US,en;q=0.5',
      'x-agent': 'v2.2|passenger|WEBAPP|3.11.0||5.0',
      'content-type': 'application/json',
      'x-authorization': `${accessToken}`,
    },
    referrer: 'https://app.tapsi.cab/',
    method: 'GET',
    mode: 'cors',
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(`${response.status}`);
        }
      } else {
        return response.json();
      }
    })
    .then(({ data }) => data.rideHistories)
    .catch((error) => Promise.reject(error));
};
