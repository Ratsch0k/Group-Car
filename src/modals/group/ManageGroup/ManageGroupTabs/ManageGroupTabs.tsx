import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Paper, Tab, Tabs, Theme, Typography} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import SwipeableView from 'react-swipeable-views';
import {createStyles, makeStyles} from '@material-ui/styles';
import ManageGroupMembersTab from './ManageGroupMembersTab';
import ManageGroupCarsTab from './ManageGroupCarsTab';
import config from 'config';
import {
  useAppDispatch,
  useAppSelector,
  useShallowAppSelector,
} from 'lib/redux/hooks';
import {
  getModalRoute,
  goToModal,
} from 'lib/redux/slices/modalRouter/modalRouterSlice';
import {getSelectedGroup} from 'lib/redux/slices/group';

/**
 * Styles.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperOutlined: {
      borderColor: theme.palette.secondary.main,
    },
    tabContent: {
      height: 'calc(100% - 59px)',
    },
    container: {
      height: '100%',
    },
    fabContainer: {
      position: 'relative',
    },
  }),
);


/**
 * Component for displaying the group management tabs.
 * @param props Props
 */
export const ManageGroupTabs: React.FC = () => {
  const {t} = useTranslation();
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const route = useAppSelector(getModalRoute);
  const getTabFromRoute = useCallback(() => {
    return route.endsWith('cars') ? 1 : 0;
  }, [route]);
  const [selectedTab, setSelectedTab] = useState<number>(getTabFromRoute());
  const memberFabPortal = useRef<HTMLDivElement>(null);
  const carFabPortal = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const group = useShallowAppSelector(getSelectedGroup)!;

  useEffect(() => {
    setSelectedTab(getTabFromRoute());
  }, [route, getTabFromRoute]);

  /**
   * Handles select tab action.
   * @param index The selected tab.
   */
  const handleSelectTab = (index: number) => {
    if (index === 0) {
      dispatch(goToModal(`/group/manage/${group.id}/members`));
    } else {
      dispatch(goToModal(`/group/manage/${group.id}/cars`));
    }
    setSelectedTab(index);
  };

  return (
    <Paper
      variant='outlined'
      classes={{
        outlined: classes.paperOutlined,
      }}
      className={classes.container}
    >
      <Tabs
        value={selectedTab}
        onChange={(_event, index: number) => handleSelectTab(index)}
        variant='fullWidth'
      >
        <Tab
          label={
            <>
              <Typography display='inline'>
                {t('modals.group.manage.tabs.members.title')}
              </Typography>
              <Typography color='textSecondary' display='inline'>
                ({group.members.length}/{config.group.maxMembers})
              </Typography>
            </>
          }
          id='group-tab-members'
          aria-controls='group-tabpanel-members'
        />
        <Tab
          label={<>
            <Typography display='inline'>
              {t('modals.group.manage.tabs.cars.title')}
            </Typography>
            <Typography color='textSecondary' display='inline'>
              ({group.cars.length}/{config.group.maxCars})
            </Typography>
          </>}
          id='group-tab-cars'
          aria-controls='group-tabpanel-cars'
        />
      </Tabs>
      <SwipeableView
        index={selectedTab}
        onChangeIndex={(index: number) => handleSelectTab(index)}
        className={classes.tabContent}
        containerStyle={{height: '100%'}}
        disableLazyLoading={true}
      >
        <ManageGroupMembersTab
          className={classes.tabContent}
          visible={selectedTab === 0}
          fabPortal={memberFabPortal}
        />
        <ManageGroupCarsTab
          className={classes.tabContent}
          visible={selectedTab === 1}
          fabPortal={carFabPortal}
        />
      </SwipeableView>
      <div className={classes.fabContainer}>
        <div ref={memberFabPortal} />
      </div>
      <div className={classes.fabContainer}>
        <div ref={carFabPortal} />
      </div>
    </Paper>
  );
};

export default ManageGroupTabs;
