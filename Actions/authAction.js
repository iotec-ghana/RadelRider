import {SIGN_IN, SIGN_OUT, REGISTER, CHECK_LOGIN_STATUS} from './types';
import axios from 'axios';
import {BASE_URL} from '../constants';
import {AsyncStorage} from 'react-native';

export const isSignedIn = data => async dispatch => {
  try {
    //console.log(data);
    const response = await axios.post(BASE_URL + '/login/', data);
    const authData = {
      isAuthenticated: true,
      user: response.data,
    };

    await AsyncStorage.setItem('authdata', JSON.stringify(authData));

    dispatch({
      type: SIGN_IN,
      payload: authData,
      error: '',
    });
    //navigation.navigate('Main');
  } catch (e) {
    const authData = {
      isAuthenticated: false,
    };
    console.log(e.message);
    if (
      e.message === 'Request failed with status code 500' ||
      e.message === 'Request failed with status code 502' ||
      e.message === 'Request failed with status code 503' ||
      e.message === 'Request failed with status code 404'
    ) {
      dispatch({
        type: SIGN_IN,
        payload: authData,
        error: 'Internal server error',
      });
    } else {
      dispatch({
        type: SIGN_IN,
        payload: authData,
        error: 'Your email or password is incorrect. Please try again',
      });
    }
  }
};

export const isSignedOut = navigation => async dispatch => {
  try {
    // set header authorization token
    // const config = {
    //   headers: {Authorization: `Bearer ${t.token}`},
    // };
    // const response = await axios.post(
    //   BASE_URL + 'users/me/logout',
    //   t.user,
    //   config,
    // );

    await AsyncStorage.removeItem('authdata');

    dispatch({
      type: SIGN_OUT,
    });

    navigation.navigate('Intro');
  } catch (e) {}
};
export const loginStatus = () => async dispatch => {
  try {
    const user = await AsyncStorage.getItem('authdata');
    const data = JSON.parse(user);

    dispatch({
      type: CHECK_LOGIN_STATUS,
      payload: data,
    });
  } catch (e) {}
};
export const RegisterUser = (payload, navigation) => async dispatch => {
  try {
    const response = await axios.post(BASE_URL + '/register/', payload);
    // const authData = {
    //   isAuthenticated: true,
    //   user: response.data,
    // };

    // await AsyncStorage.setItem('authdata', JSON.stringify(authData));

    // dispatch({
    //   type: REGISTER,
    //   payload: authData,
    //   error2: '',
    // });
    // console.log(response.data.phone_number);
    navigation.navigate('PhoneVerificationActivity', {
      userid: response.data.id,
      phone: response.data.phone_number,
      token: response.data.token,
      password: payload.password,
      email: payload.email,
    });
  } catch (e) {
    console.log(e);
    const authData = {
      isAuthenticated: false,
    };
    if (
      e.message === 'Request failed with status code 500' ||
      e.message === 'Request failed with status code 502' ||
      e.message === 'Request failed with status code 503' ||
      e.message === 'Request failed with status code 404'
    ) {
      dispatch({
        type: REGISTER,
        payload: authData,
        error2: 'Internal server error',
      });
    } else {
      dispatch({
        type: REGISTER,
        payload: authData,
        error2: 'Email is  already taken',
      });
    }
  }
};
