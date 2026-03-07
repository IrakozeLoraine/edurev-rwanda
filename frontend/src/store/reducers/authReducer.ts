import type { AuthState } from "../../types";

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

type AuthAction =
  | { type: "AUTH_REQUEST" }
  | { type: "AUTH_SUCCESS"; payload: { user: AuthState["user"]; token: string } }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "AUTH_CLEAR_ERROR" };

const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_REQUEST":
      return { ...state, loading: true, error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token ?? state.token,
        error: null,
      };
    case "AUTH_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "AUTH_LOGOUT":
      return { token: null, user: null, loading: false, error: null };
    case "AUTH_CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export default authReducer;
