import {createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {push, CallHistoryMethodAction} from 'connected-react-router';
import {RestError, User} from 'lib';
import {goToModal} from '../modalRouter/modalRouterSlice';
import {setUser, setSignUpRequestSent} from './authSlice';
import {
  login as loginApi,
  logout as logoutApi,
  signUp as signUpApi,
  checkLoggedIn as checkLoggedInApi,
} from 'lib/api';

interface LoginParams {
  username: string;
  password: string;
}
export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginParams, thunkApi) => {
    try {
      const res = await loginApi(data.username, data.password);

      thunkApi.dispatch(setUser(res.data));
      return res;
    } catch (e) {
      const error = e as AxiosError<RestError>;
      return thunkApi.rejectWithValue(error.response);
    }
  },
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, {dispatch}) => {
    const res = await logoutApi();

    dispatch(setUser(undefined));

    dispatch(push('/'));
    return res;
  },
);

interface SignUpParams {
  username: string;
  email: string;
  password: string;
  offset: number;
}
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data: SignUpParams, {dispatch}) => {
    const res = await signUpApi(
      data.username,
      data.email,
      data.password,
      data.offset,
    );

    if ((res.data as User).id) {
      dispatch(setUser(res.data as User));
    } else {
      dispatch(setSignUpRequestSent(true));
    }

    return res;
  },
);

export const checkLoggedIn = createAsyncThunk(
  'auth/checkLoggedIn',
  async (_, {dispatch}) => {
    try {
      const res = await checkLoggedInApi();
      dispatch(setUser(res.data));
      return res;
    } catch (e) {
      console.dir(e);
      dispatch(setUser(undefined));
      return e;
    }
  },
);

export const openAuthDialog = (): CallHistoryMethodAction<unknown> =>
  goToModal('/auth');