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

        <div className="profile-card__stats">
          <div className="profile-stat">
            {/* <span className="profile-stat__value">{completionPercent}%</span> */}
            <span className="profile-stat__label">Profile Complete</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value">5</span>
            <span className="profile-stat__label">Years Active</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value">1,234</span>
            <span className="profile-stat__label">Orders Managed</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="profile-form-container">
        {/* <form onSubmit={handleSave} className="profile-form">
          <div className="profile-section">
            <h3 className="profile-section__title">Personal Information</h3>
            <div className="profile-grid">
              <div className="profile-field">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  type="text"
                  disabled={!isEditing}
                  placeholder="Enter first name"
                />
              </div>
              <div className="profile-field">
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  type="text"
                  disabled={!isEditing}
                  placeholder="Enter last name"
                />
              </div>
              <div className="profile-field">
                <Input
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  disabled={!isEditing}
                  placeholder="Enter email"
                />
              </div>
              <div className="profile-field">
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="profile-section__title">Address</h3>
            <div className="profile-grid">
              <div className="profile-field profile-field--full">
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  type="text"
                  disabled={!isEditing}
                  placeholder="Enter street address"
                />
              </div>
              <div className="profile-field">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  type="text"
                  disabled={!isEditing}
                  placeholder="Enter city"
                />
              </div>
              <div className="profile-field">
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  type="text"
                  disabled={!isEditing}
                  placeholder="Enter country"
                />
              </div>
              <div className="profile-field">
                <Input
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  type="text"
                  disabled={!isEditing}
                  placeholder="Enter postal code"
                />
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="profile-section__title">Bio</h3>
            <div className="profile-field profile-field--full">
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                className="profile-textarea"
                rows={4}
              />
            </div>
          </div>

          {isEditing && (
            <div className="profile-form__actions">
              <Button
                type="button"
                label="Cancel"
                variant="secondary"
                size="md"
                onClick={handleCancel}
              />
              <Button
                type="submit"
                label={isSaving ? "Saving..." : "Save Changes"}
                variant="primary"
                size="md"
                disabled={isSaving}
              />
            </div>
          )}
        </form> */}
      </div>

      {/* Password Change Section */}
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