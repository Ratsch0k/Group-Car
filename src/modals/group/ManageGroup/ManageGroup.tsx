import React, {useEffect} from 'react';
import {
  RestError,
  useStateIfMounted,
  CenteredCircularProgress,
  useApi,
  GroupWithOwnerAndMembersAndInvitesAndCars,
} from 'lib';
import ManageGroupErrorHandler from './ManageGroupNoGroupError';
import {ManageGroupOverview} from './ManageGroupOverview';
import {useParams} from 'react-router-dom';
import {useAppDispatch} from 'lib/redux/hooks';
import {unwrapResult} from '@reduxjs/toolkit';
import {getGroup} from 'lib/redux/slices/group';

/**
 * Props for the manage group component.
 */
export interface ManageGroupProps {
  /**
   * Id of the group. If not provided this
   * component will try to get the parameter `:groupId` from
   * the path. If that's not possible it will show an error
   * message.
   */
  groupId?: number;
}

/**
 * Component for managing the specified group.
 * @param props - The props.
 */
export const ManageGroup: React.FC<ManageGroupProps> =
(props: ManageGroupProps) => {
  const dispatch = useAppDispatch();
  const {getInvitesOfGroup, getMembers, getCars} = useApi();
  const {groupId: groupIdParam} = useParams<{groupId: string}>();
  const [groupData, setGroupData] =
      useStateIfMounted<GroupWithOwnerAndMembersAndInvitesAndCars | null>(null);
  const [error, setError] = useStateIfMounted<RestError | null | boolean>(null);


  // Get the group
  useEffect(() => {
    // Get the group id
    let selectedGroupId: number;

    if (typeof props.groupId === 'number') {
      selectedGroupId = props.groupId;
    } else {
      // Try to get the groupId from the path
      selectedGroupId = parseInt(groupIdParam);
    }

    if (typeof selectedGroupId !== 'undefined' && !isNaN(selectedGroupId)) {
      // Get group, members and invites
      Promise.all([
        dispatch(getGroup({id: selectedGroupId})).then(unwrapResult),
        getMembers(selectedGroupId),
        getInvitesOfGroup(selectedGroupId),
        getCars(selectedGroupId),
      ]).then(([group, members, invites, cars]) => {
        setGroupData({
          ...group,
          invites: invites.data.invites,
          members: members.data.members,
          cars: cars.data.cars,
        });
      }).catch(() => {
        setError(true);
      });
    } else {
      setError(true);
    }

    // eslint-disable-next-line
  }, [props.groupId, groupIdParam]);

  if (groupData === null && error === null) {
    return <CenteredCircularProgress />;
  } else if (error === null && groupData !== null) {
    return <ManageGroupOverview group={groupData} setGroup={setGroupData}/>;
  } else {
    return <ManageGroupErrorHandler/>;
  }
};

export default ManageGroup;
