import type { Dispatch } from "redux";
import api from "../../axios";

export const login =
  (email: string, password: string) => async (dispatch: Dispatch) => {
    dispatch({ type: "AUTH_REQUEST" });
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      dispatch({ type: "AUTH_SUCCESS", payload: { token: res.data.token } });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Login failed";
      dispatch({ type: "AUTH_FAILURE", payload: message });
    }
  };

export const register =
  (name: string, email: string, password: string) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: "AUTH_REQUEST" });
    try {
      await api.post("/auth/register", { name, email, password });
      // Auto-login after registration
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      dispatch({ type: "AUTH_SUCCESS", payload: { token: res.data.token } });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Registration failed";
      dispatch({ type: "AUTH_FAILURE", payload: message });
    }
  };

export const logout = () => (dispatch: Dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: "AUTH_LOGOUT" });
};
