import React, {useState, useEffect, useCallback} from 'react';
import io from 'socket.io-client';
import {useSnackBar} from 'lib/hooks';
import {useTranslation} from 'react-i18next';
import {SocketGroupActionData} from 'typings/socket';
import {useAppDispatch, useAppSelector} from 'lib/redux/hooks';
import {getUser} from 'lib/redux/slices/auth';
import {
  addCar,
  getGroupState,
  selectAndUpdateGroup,
  update,
  updateCar,
} from 'lib/redux/slices/group';
import {createMatchSelector, RouterRootState} from 'connected-react-router';

/**
 * Element for creating and providing the `GroupContext`.
 * Will load groups and define all needed values.
 *
 * This element expects the `AuthContext` and
 * `ApiContext` to be higher
 * in the tree. The `AuthContext` is needed
 * because it will reload all groups if
 * the logged in user changes and the `ApiContext`
 * is needed because it needs the api calls to load
 * group data.
 * @param props Children.
 */
export const GroupUpdater: React.FC = (props) => {
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const {selectedGroup} = useAppSelector(getGroupState);
  const {show} = useSnackBar();
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const {t} = useTranslation();
  const match = useAppSelector(
    createMatchSelector<RouterRootState, {id: string}>('/group/:id'),
  );
  const [errorNotified, setErrorNotified] = useState<boolean>(false);

  /**
   * Handles socket errors.
   */
  const socketErrorHandler = useCallback(() => {
    if (!errorNotified) {
      show('error', t('errors.socketConnection'));
      setErrorNotified(true);
    }
  }, [show, t, errorNotified, setErrorNotified]);

  /**
   * Handles update events.
   */
  const socketActionHandler = useCallback((data: SocketGroupActionData) => {
    switch (data.action) {
      case 'add': {
        dispatch(addCar(data.car));
        break;
      }
      case 'drive': {
        dispatch(updateCar(data.car));
        break;
      }
      case 'park': {
        dispatch(updateCar(data.car));
        break;
      }
    }
  }, [dispatch]);

  /**
   * Handle connection to websocket.
   */
  useEffect(() => {
    if (socket) {
      socket.disconnect();
      setSocket(undefined);
    }

    if (selectedGroup) {
      setSocket(io(`/group/${selectedGroup.id}`, {path: '/socket'}));
    }

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(undefined);
      }
    };
    /* eslint-disable-next-line  */
  }, [selectedGroup?.id]);

  /**
   * Adds event listeners to the socket.
   */
  useEffect(() => {
    if (socket) {
      socket.off('connect_error', socketErrorHandler);
      socket.off('error', socketErrorHandler);
      socket.off('update', socketActionHandler);
      setErrorNotified(false);
      socket.on('connect_error', socketErrorHandler);
      socket.on('error', socketErrorHandler);
      socket.on('update', socketActionHandler);
    }

    return () => {
      socket?.off('connect_error', socketErrorHandler);
      socket?.off('error', socketErrorHandler);
      socket?.off('update', socketActionHandler);
    };
    /* eslint-disable-next-line */
  }, [socket]);

  useEffect(() => {
    if (match && !selectedGroup) {
      dispatch(selectAndUpdateGroup({id: parseInt(match.params.id, 10)}));
    }
    /* eslint-disable-next-line */
  }, [match]);

  useEffect(() => {
    if (user) {
      dispatch(update());
    }
    // eslint-disable-next-line
  }, [user]);

  return (
    <React.Fragment>
      {props.children}
    </React.Fragment>
  );
};

export default GroupUpdater;