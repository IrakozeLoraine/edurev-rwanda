import type { AuthState } from "../../types";

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const AUTH_REQUEST = "AUTH_REQUEST" as const;
export const AUTH_SUCCESS = "AUTH_SUCCESS" as const;
export const AUTH_FAILURE = "AUTH_FAILURE" as const;
export const AUTH_LOGOUT = "AUTH_LOGOUT" as const;
export const AUTH_CLEAR_ERROR = "AUTH_CLEAR_ERROR" as const;

export type AuthAction =
  | { type: typeof AUTH_REQUEST }
  | { type: typeof AUTH_SUCCESS; payload: { user: AuthState["user"]; token: string | null } }
  | { type: typeof AUTH_FAILURE; payload: string }
  | { type: typeof AUTH_LOGOUT }
  | { type: typeof AUTH_CLEAR_ERROR };

const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AUTH_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token ?? state.token,
        error: null,
      };
    case AUTH_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case AUTH_LOGOUT:
      return { token: null, user: null, loading: false, error: null };
    case AUTH_CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

export default authReducer;
