import {Request} from 'lib';
import axios from 'lib/client';

export type ParkCarRequest = Request<void>;
export type ParkCar = (
  groupId: number,
  carId: number,
  latitude: number,
  longitude: number,
) => ParkCarRequest;

/**
 * Sends a request to park the specified car of the specified group
 * at the specified location. The location is represented with latitude
 * and longitude.
 * @param groupId   Id of the group
 * @param carId     Id of the car
 * @param latitude  Latitude of the location
 * @param longitude Longitude of the location
 */
export const parkCar: ParkCar = (
  groupId,
  carId,
  latitude,
  longitude,
) => {
  return axios.put(
    `/api/group/${groupId}/car/${carId}/park`,
    {
      latitude,
      longitude,
    },
  );
};
