import {
  IconButton,
  Snackbar,
  SnackbarCloseReason,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {Alert} from '@material-ui/lab';
import {AxiosError} from 'axios';
import axios from 'lib/client';
import isRestError from 'lib/util/isRestError';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

/**
 * Types of snackbars.
 */
export type SnackbarType = 'success' | 'warning' | 'error' | 'info';
export interface ShowOptions {
  type: SnackbarType;
  content: string | JSX.Element;
  action?: JSX.Element;
  withClose?: boolean;
}

export type Show = (
  typeOrOptions: SnackbarType | ShowOptions,
  content?: string | JSX.Element,
) => void;

export interface SnackbarContext {
  show: Show;
}

/**
 * Default SnackbarContext.
 */
export const SnackbarContext = React.createContext<SnackbarContext>({
  show: () => undefined,
});
SnackbarContext.displayName = 'SnackbarContext';

/**
 * Provider for the SnackbarContext.
 * @param props Props
 */
export const SnackbarProvider: React.FC = (props) => {
  const [queue, setQueue] = useState<ShowOptions[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [activeSnack, setActiveSnack] = useState<ShowOptions>();
  const {t} = useTranslation();


  const show: Show = useCallback((
    typeOrOptions,
    content,
  ) => {
    let options: ShowOptions;

    if (typeof typeOrOptions === 'object') {
      options = typeOrOptions;
    } else {
      if (content === undefined) {
        throw new TypeError('If typeOrOptions is the type, ' +
          'the content has to be provided');
      }

      options = {
        type: typeOrOptions,
        content,
      };
    }

    setOpen(false);
    setQueue((prev) => [...prev, options]);
  }, []);

  useEffect(() => {
    if (!open && queue.length && !activeSnack) {
      setActiveSnack(queue[0]);
      setQueue((prev) => prev.slice(1, prev.length));
      setOpen(true);
    } else if (open && queue.length) {
      setOpen(false);
    }
  }, [open, queue, activeSnack]);

  const handleClose = useCallback((
    event: React.SyntheticEvent<unknown, Event>,
    reason: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }, []);

  const handleOnExited = useCallback(() => {
    setActiveSnack(undefined);
  }, []);


  useEffect(() => {
    axios.interceptors.response.use(
      (res) => res,
      (e: AxiosError) => {
        if (e.response && isRestError(e.response.data)) {
          if (
            e.response.config.url !== '/auth/token' ||
            e.response.config.method !== 'put' ||
            e.response.status !== 401
          ) {
            const {errorName, ...rest} = e.response.data.detail;
            show('error', t('errors.' + errorName, rest));
          }
        } else {
          show('error', e.message);
        }
      },
    );
    axios.interceptors.request.use(
      (res) => res,
      (e: AxiosError) => {
        if (e.response && isRestError(e.response.data)) {
          if (
            e.response.config.url !=='/auth/token' ||
            e.response.config.method !== 'put' ||
            e.response.status !== 401
          ) {
            const {errorName, ...rest} = e.response.data.detail;
            show('error', t('errors.' + errorName, rest));
          }
        } else {
          show('error', e.message);
        }
      },
    );
  }, [show]);

  return (
    <SnackbarContext.Provider value={{show}}>
      {props.children}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        onExited={handleOnExited}
      >
        {
          activeSnack &&
          <Alert
            severity={activeSnack.type}
            variant='filled'
            action={
              <React.Fragment>
                {activeSnack.action}
                {
                  activeSnack.withClose &&
                  <IconButton
                    onClick={() => setOpen(false)}
                    color='inherit'
                    size='small'
                  >
                    <CloseIcon fontSize='small'/>
                  </IconButton>
                }
              </React.Fragment>
            }
            closeText={t('misc.close')}
          >
            {activeSnack.content}
          </Alert>
        }
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
