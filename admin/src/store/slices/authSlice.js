import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    isAuthenticated: false
  },
  reducers: {
    loginRequest(state) {
      state.loading = true;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    loginFailure(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    getUserRequest(state) {
      state.loading = true;
    },
    getUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    getUserFailure(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    logoutRequest(state) {
      state.loading = true;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    logoutFailure(state) {
      state.loading = false;
    },
    forgotPasswordRequest(state) {
      state.loading = true;
    },
    forgotPasswordSuccess(state) {
      state.loading = false;
    },
    forgotPasswordFailure(state) {
      state.loading = false;
    },
    resetPasswordRequest(state) {
      state.loading = true;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    resetPasswordFailure(state) {
      state.loading = false;
    },
    updateProfileRequest(state) {
      state.loading = true;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
    },
    updateProfileFailure(state) {
      state.loading = false;
    },
    updatePasswordRequest(state) {
      state.loading = true;
    },
    updatePasswordSuccess(state) {
      state.loading = false;
    },
    updatePasswordFailure(state) {
      state.loading = false;
    },
    resetAuthSlice(state) {
      state.loading = false;
      state.user = state.user; // Preserve user data
      state.isAuthenticated = state.isAuthenticated; // Preserve authentication status
    }
  }
});

export const login = (data) => async (dispatch) => {
  dispatch(authSlice.actions.loginRequest());
  try {
    await axiosInstance.post("/auth/login", data).then((res) => {
      if (res.data.user.role === "Admin") {
        dispatch(authSlice.actions.loginSuccess(res.data.user));
        toast.success(res.data.message);
      } else {
        dispatch(authSlice.actions.loginFailure());
        toast.error(res.data.message);
      }
    });
  } catch (error) {
    dispatch(authSlice.actions.loginFailure());
    toast.error(error.response?.data?.message || "Login failed.");
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(authSlice.actions.getUserRequest());
  try {
    await axiosInstance.get("/auth/me").then((res) => {
      dispatch(authSlice.actions.getUserSuccess(res.data.user));
    });
  } catch (error) {
    dispatch(authSlice.actions.getUserFailure());
    toast.error(error.response?.data?.message || "Failed to fetch user data.");
  }
};

export const logout = () => async (dispatch) => {
  dispatch(authSlice.actions.logoutRequest());
  try {
    await axiosInstance.get("/auth/logout").then((res) => {
      dispatch(authSlice.actions.logoutSuccess());
      toast.success(res.data.message);
      dispatch(authSlice.actions.resetAuthSlice());
    });
  } catch (error) {
    dispatch(authSlice.actions.logoutFailure());
    toast.error(error.response?.data?.message || "Failed to logout.");
    dispatch(authSlice.actions.resetAuthSlice());
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(authSlice.actions.forgotPasswordRequest());
  try {
    await axiosInstance
      .post("/auth/password/forgot?frontendUrl=http://localhost:5174", email)
      .then((res) => {
        dispatch(authSlice.actions.forgotPasswordSuccess());
        toast.success(res.data.message);
      });
  } catch (error) {
    dispatch(authSlice.actions.forgotPasswordFailure());
    toast.error(error.response?.data?.message || "Failed to send reset link.");
  }
};

export const resetPassword =
  (password, confirmPassword, token) => async (dispatch) => {
    dispatch(authSlice.actions.resetPasswordRequest());
    try {
      await axiosInstance
        .put(`/auth/password/reset/${token}`, {
          password,
          confirmPassword
        })
        .then((res) => {
          dispatch(authSlice.actions.resetPasswordSuccess(res.data.user));
          toast.success(res.data.message);
        });
    } catch (error) {
      dispatch(authSlice.actions.resetPasswordFailure());
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };

export const updateAdminProfile = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updateProfileRequest());
  try {
    const res = await axiosInstance
      .put("/auth/profile/update", data)
      .then((res) => {
        dispatch(authSlice.actions.updateProfileSuccess(res.data.user));
        toast.success(res.data.message);
      });
  } catch (error) {
    dispatch(authSlice.actions.updateProfileFailure());
    toast.error(error.response?.data?.message || "Failed to update profile.");
  }
};

export const updatePassword =
  (currentPassword, newPassword, confirmNewPassword) => async (dispatch) => {
    dispatch(authSlice.actions.updatePasswordRequest());
    try {
      await axiosInstance
        .put("/auth/password/update", {
          currentPassword,
          newPassword,
          confirmNewPassword
        })
        .then((res) => {
          dispatch(authSlice.actions.updatePasswordSuccess());
          toast.success(res.data.message);
        });
    } catch (error) {
      dispatch(authSlice.actions.updatePasswordFailure());
      toast.error(
        error.response?.data?.message || "Failed to update password."
      );
    }
  };

export const resetAuthSlice = () => (dispatch) => {
  dispatch(authSlice.actions.resetAuthSlice());
};

export default authSlice.reducer;
