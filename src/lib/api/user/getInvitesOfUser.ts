import Axios, {AxiosInstance} from 'axios';
import {Request, InviteWithGroupAndInviteSender} from '..';

/**
 * Response of get invites of users request.
 */
export interface GetInvitesOfUserResponse {
  invites: (InviteWithGroupAndInviteSender)[];
}

/**
 * Get invites of user request.
 */
export type GetInvitesOfUserRequest = Request<GetInvitesOfUserResponse>;
export type GetInvitesOfUser = () => GetInvitesOfUserRequest;

/**
 * Gets all invites of the currently logged in user.
 * @param axios Optional axios instance
 */
export const getInvitesOfUser: GetInvitesOfUser = (
  axios: AxiosInstance = Axios,
) => {
  return axios.get<GetInvitesOfUserResponse>('/api/user/invite');
};
