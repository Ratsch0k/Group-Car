import axios from 'axios';
import {Request} from 'lib';

export type LogOutRequest = Request<void>;

/**
 * Sends a logout request to the backend.
 * @return the request and a method to cancel it
 */
export const logout = (): LogOutRequest => {
  const source = axios.CancelToken.source();

  const request = axios.put(
      '/auth/logout',
      {
        cancelToken: source.token,
      },
  );

  return {
    request,
    cancel: source.cancel,
  };
};