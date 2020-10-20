import React, {useEffect, useRef, useState} from 'react';
import {GroupWithOwnerAndMembersAndInvites} from 'lib';
import ManageGroupOverviewInfo from './ManageGroupGroupInfo';
import ManageGroupTabs from './ManageGroupTabs';
import {makeStyles, useMediaQuery, useTheme} from '@material-ui/core';

export interface ManageGroupOverviewProps {
  group: GroupWithOwnerAndMembersAndInvites;
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '400px',
  },
  overview: {
    flex: 'none',
  },
  tabsDesktop: {
    height: '400px',
  },
});

/**
 * Overview over the specified group.
 */
export const ManageGroupOverview: React.FC<ManageGroupOverviewProps> =
(props: ManageGroupOverviewProps) => {
  const {group} = props;
  const classes = useStyles();
  const theme = useTheme();
  const smallerXs = useMediaQuery(theme.breakpoints.down('xs'));
  const [tabHeight, setTabHeight] = useState<number>(400);
  const containerRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);

  const animate = () => {
    return window.requestAnimationFrame(() => {
      const containerHeight = containerRef.current?.clientHeight;
      const overviewHeight = overviewRef.current?.clientHeight;

      if (containerHeight && overviewHeight) {
        setTabHeight(containerHeight - overviewHeight);
      }
    });
  };

  useEffect(() => {
    const handleResize = () => {
      animationFrameId.current = animate();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <div
      className={classes.container}
      ref={containerRef}
    >
      <div
        className={classes.overview}
        ref={overviewRef}
      >
        <ManageGroupOverviewInfo group={group}/>
      </div>
      <div
        className={smallerXs ? undefined : classes.tabsDesktop}
        style={{height: smallerXs ? tabHeight : undefined}}
      >
        <ManageGroupTabs group={group}/>
      </div>
    </div>
  );
};

export default ManageGroupOverviewProps;
