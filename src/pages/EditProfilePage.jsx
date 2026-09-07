import { useState, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import {
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  changePassword,
} from "../api/userApi";

function EditProfilePage() {
  const { user, refreshUser } = useContext(AuthContext);

  // --- Account details form ---
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [savingDetails, setSavingDetails] = useState(false);

  // --- Avatar / cover ---
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [savingCover, setSavingCover] = useState(false);

  // --- Password form ---
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setSavingDetails(true);
    try {
      await updateAccountDetails({ username, email, fullName });
      await refreshUser();
      toast.success("Account details updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSavingDetails(false);
    }
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    if (!avatarFile) return;
    setSavingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      await updateAvatar(formData);
      await refreshUser();
      setAvatarFile(null);
      toast.success("Avatar updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Avatar update failed");
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleCoverSubmit = async (e) => {
    e.preventDefault();
    if (!coverFile) return;
    setSavingCover(true);
    try {
      const formData = new FormData();
      formData.append("coverImage", coverFile);
      await updateCoverImage(formData);
      await refreshUser();
      setCoverFile(null);
      toast.success("Cover image updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cover update failed");
    } finally {
      setSavingCover(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword({ oldPassword, newPassword, confirmPassword });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed!");
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message =
        Array.isArray(errors) && errors.length > 0
          ? errors.join(", ")
          : err.response?.data?.message || "Password change failed";
      toast.error(message);
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Edit Profile</h1>

      {/* Account details */}
      <form
        onSubmit={handleDetailsSubmit}
        className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200"
      >
        <h2 className="text-lg font-semibold mb-4 text-neutral-900">
          Account Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button
          type="submit"
          disabled={savingDetails}
          className="bg-red-600 cursor-pointer text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {savingDetails ? "Saving..." : "Save Details"}
        </button>
      </form>

      {/* Avatar */}
      <form
        onSubmit={handleAvatarSubmit}
        className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200"
      >
        <h2 className="text-lg font-semibold mb-4 text-neutral-900">Avatar</h2>
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user.avatar?.url}
            alt={user.username}
            className="w-16 h-16 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
            className="text-sm text-neutral-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-600 file:font-medium hover:file:bg-red-100"
          />
        </div>
        <button
          type="submit"
          disabled={savingAvatar || !avatarFile}
          className="bg-red-600 enabled:cursor-pointer text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {savingAvatar ? "Uploading..." : "Update Avatar"}
        </button>
      </form>

      {/* Cover image */}
      <form
        onSubmit={handleCoverSubmit}
        className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200"
      >
        <h2 className="text-lg font-semibold mb-4 text-neutral-900">
          Cover Image
        </h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverFile(e.target.files[0])}
          className="text-sm text-neutral-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-600 file:font-medium hover:file:bg-red-100 mb-4"
        />
        <button
          type="submit"
          disabled={savingCover || !coverFile}
          className="block enabled:cursor-pointer bg-red-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {savingCover ? "Uploading..." : "Update Cover"}
        </button>
      </form>

      {/* Change password */}
      <form
        onSubmit={handlePasswordSubmit}
        className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200"
      >
        <h2 className="text-lg font-semibold mb-4 text-neutral-900">
          Change Password
        </h2>
        <div className="flex flex-col gap-3 mb-4">
          <input
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button
          type="submit"
          disabled={savingPassword}
          className="bg-red-600 cursor-pointer text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {savingPassword ? "Saving..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

export default EditProfilePage;
