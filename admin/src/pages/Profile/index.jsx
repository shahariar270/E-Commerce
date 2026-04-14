import React, { useEffect, useState } from "react";
import Button from "../../components/Buttons";
import Input from "../../components/Input";
import { useDispatch } from "react-redux";
import { getProfile } from "@Store/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState();

  useEffect(() => {
    dispatch(getProfile()).then(({ payload }) => {
      setProfile(payload.data)
    })
  }, [])

  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate saving
    setTimeout(() => {
      setProfile(formData);
      setIsSaving(false);
      setIsEditing(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  return (
    <div className="st-layout--content">
      <div className="st-page__header">
        <div className="st-page__title">
          <h2>Profile</h2>
          <p>Manage your personal information and account settings</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-card__header">
          <div className="profile-avatar">
            <span>{profile?.first_name.charAt(0)}{profile?.last_name.charAt(0)}</span>
          </div>
          <div className="profile-info">
            <h3>{profile?.first_name} {profile?.last_name}</h3>
            <p>{profile?.email}</p>
            <span className="profile-role">Administrator</span>
          </div>
          {!isEditing && (
            <Button
              label="Edit Profile"
              variant="primary"
              size="sm"
              onClick={handleEdit}
            />
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className="profile-form-container">

      </div>

      {/* <div className="password-section">
        <h3 className="profile-section__title">Change Password</h3>
        <div className="password-form">
          <div className="profile-field">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              disabled={!isEditing}
              placeholder="Enter current password"
            />
          </div>
          <div className="profile-field">
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              disabled={!isEditing}
              placeholder="Enter new password"
            />
          </div>
          <div className="profile-field">
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              disabled={!isEditing}
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Profile;