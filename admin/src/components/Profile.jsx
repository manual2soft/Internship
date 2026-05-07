import React, { useState } from "react";
import avatar from "../assets/avatar.jpg";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { updateAdminProfile, updatePassword } from "../store/slices/authSlice";
const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });

  const [avatarFile, setAvatarFile] = useState(null);

  const [updatingSection, setUpdatingSection] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
  };

  const handleProfileChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();

  const updateProfile = () => {
    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("email", editData.email);
    // Append avatar file if available
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    setUpdatingSection("profile");
    dispatch(updateAdminProfile(formData));
  };

  const handleUpdatePassword = () => {
    setUpdatingSection("password");
    dispatch(
      updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmNewPassword
      )
    );
  };

  return (
    <>
      <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
        {/* Header */}
        <div className="flex-1 md:p-6 md:pb-0">
          <Header />
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-gray-600 mb-6">Manage your profile.</p>
        </div>

        {/* Profile Content */}
        <div className="max-w-4xl md:px-4 py-8">
          {/* Profile Card */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-6 flex-col md:flex-row mb-10">
            <img
              src={(user && user?.avatar?.url) || avatar}
              alt={user?.name || avatar}
              className="w-32 h-32 rounded-full object-cover border"
              loading="lazy"
            />
            <div>
              <p className="text-xl font-medium">Name : {user?.name}</p>
              <p className="text-md text-gray-600">Email : {user?.email}</p>
              <p className="text-sm text-blue-500">Role : {user?.role}</p>
            </div>
          </div>

          {/* Update Profile Section */}
          <div className="bg-gray-100 shadow-md rounded-2xl p-6 mb-10">
            <h3 className="text-xl font-semibold mb-4">Update Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleProfileChange}
                className="p-2 border rounded-md"
                placeholder="Your Name"
              />
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleProfileChange}
                className="p-2 border rounded-md"
                placeholder="Your Email"
              />
              <input
                type="file"
                name="avatar"
                onChange={handleAvatarChange}
                className="p-2 border rounded-md col-span-1 md:col-span-2"
                placeholder="Upload Avatar"
              />
            </div>
            <button
              onClick={updateProfile}
              disabled={loading}
              className="flex justify-center items-center gap-2 rounded-lg bg-blue-500 text-white font-semibold py-2 px-4 mt-4 hover:bg-blue-600 transition-all duration-300"
            >
              {loading && updatingSection === "profile" ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating Profile...</span>
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>

          {/* Update Password Section */}
          <div className="bg-gray-100 shadow-md rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">Update Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="p-2 border rounded-md"
                placeholder="Current Password"
              />

              <div className="hidden md:block"></div>

              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="p-2 border rounded-md"
                placeholder="New Password"
              />
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                className="p-2 border rounded-md"
                placeholder="Confirm New Password"
              />
            </div>
            <button
              onClick={handleUpdatePassword}
              disabled={loading}
              className="flex justify-center items-center gap-2 rounded-lg bg-blue-500 text-white font-semibold py-2 px-4 mt-4 hover:bg-blue-600 transition-all duration-300"
            >
              {loading && updatingSection === "password" ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
