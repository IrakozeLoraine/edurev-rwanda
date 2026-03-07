import type { Dispatch } from "redux";
import api from "../../axios";
import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_LOGOUT,
  AUTH_CLEAR_ERROR,
} from "../reducers/authReducer";
import type { AuthAction } from "../reducers/authReducer";

export const register =
  (name: string, email: string, password: string) =>
  async (dispatch: Dispatch<AuthAction>) => {
    dispatch({ type: AUTH_REQUEST });
    try {
      const res = await api.post("/auth/register", { name, email, password });
      dispatch({ type: AUTH_SUCCESS, payload: res.data });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Registration failed";
      dispatch({ type: AUTH_FAILURE, payload: message });
    }
  };

export const login =
  (email: string, password: string) =>
  async (dispatch: Dispatch<AuthAction>) => {
    dispatch({ type: AUTH_REQUEST });
    try {
      const res = await api.post("/auth/login", { email, password });
      dispatch({ type: AUTH_SUCCESS, payload: res.data });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Login failed";
      dispatch({ type: AUTH_FAILURE, payload: message });
    }
  };

export const loadUser = () => async (dispatch: Dispatch<AuthAction>) => {
  try {
    const res = await api.get("/auth/me");
    dispatch({
      type: AUTH_SUCCESS,
      payload: { user: res.data, token: null },
    });
  } catch {
    dispatch({ type: AUTH_LOGOUT });
  }
};

export const logout = () => (dispatch: Dispatch<AuthAction>) => {
  dispatch({ type: AUTH_LOGOUT });
};

export const clearAuthError = () => ({ type: AUTH_CLEAR_ERROR });
