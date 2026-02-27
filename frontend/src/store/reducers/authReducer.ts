import type { AuthState } from "../../types";

const AUTH_REQUEST = "AUTH_REQUEST";
const AUTH_SUCCESS = "AUTH_SUCCESS";
const AUTH_FAILURE = "AUTH_FAILURE";
const AUTH_LOGOUT = "AUTH_LOGOUT";

export type AuthAction =
  | { type: typeof AUTH_REQUEST }
  | { type: typeof AUTH_SUCCESS; payload: { token: string } }
  | { type: typeof AUTH_FAILURE; payload: string }
  | { type: typeof AUTH_LOGOUT };

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
  loading: false,
  error: null,
};

export const authReducer = (
  state = initialState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case AUTH_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTH_SUCCESS:
      return { ...state, loading: false, token: action.payload.token, error: null };
    case AUTH_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case AUTH_LOGOUT:
      return { ...state, token: null, user: null };
    default:
      return state;
  }
};
