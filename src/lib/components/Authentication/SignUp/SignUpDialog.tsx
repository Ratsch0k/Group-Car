import React from 'react';
import {
  makeStyles,
  createStyles,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core';
import {SignUpBody} from 'lib';

type Theme = import('@material-ui/core').Theme;

export const SignUpDialog: React.FC = () => {
  const useStyle = makeStyles((theme: Theme) =>
    createStyles({
      formContainer: {
        padding: theme.spacing(2),
      },
    }),
  );

  const classes = useStyle();

  return (
    <Dialog open={true}>
      <DialogTitle>
        Sign up
      </DialogTitle>
      <DialogContent className={classes.formContainer}>
        <SignUpBody withSubmit/>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
