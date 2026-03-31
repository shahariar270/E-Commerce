import React, { useState } from "react";
import Button from "../../components/Buttons";
import Input from "../../components/Input";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    phone: "+1 234 567 8900",
    address: "123 Main Street",
    city: "New York",
    country: "USA",
    postalCode: "10001",
    bio: "Experienced administrator with 5+ years in e-commerce management.",
  });

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

  // Calculate profile completion
  const fields = ["firstName", "lastName", "email", "phone", "address", "city", "country", "postalCode"];
  const filledFields = fields.filter((field) => formData[field] && formData[field].trim());
  const completionPercent = Math.round((filledFields.length / fields.length) * 100);

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <div className="profile-page__title">
          <h2>Profile</h2>
          <p>Manage your personal information and account settings</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-card__header">
          <div className="profile-avatar">
            <span>{profile.firstName.charAt(0)}{profile.lastName.charAt(0)}</span>
          </div>
          <div className="profile-info">
            <h3>{profile.firstName} {profile.lastName}</h3>
            <p>{profile.email}</p>
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
            <span className="profile-stat__value">{completionPercent}%</span>
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

      <style>{`
        .profile-page {
          max-width: 900px;

          &__header {
            margin-bottom: 24px;
          }

          &__title {
            h2 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
              color: var(--st-text-primary);
            }

            p {
              margin: 4px 0 0;
              font-size: 14px;
              color: #666;
            }
          }
        }

        .profile-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

          &__header {
            display: flex;
            align-items: center;
            gap: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--st-border);
          }

          &__stats {
            display: flex;
            justify-content: space-around;
            padding-top: 20px;
            gap: 16px;
            flex-wrap: wrap;
          }
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--st-primary), var(--st-primary-hover));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 600;
          color: white;
          flex-shrink: 0;
        }

        .profile-info {
          flex: 1;

          h3 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: var(--st-text-primary);
          }

          p {
            margin: 4px 0;
            font-size: 14px;
            color: #666;
          }
        }

        .profile-role {
          display: inline-block;
          padding: 4px 12px;
          background-color: #e3f2fd;
          color: #1976d2;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .profile-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;

          &__value {
            font-size: 24px;
            font-weight: 700;
            color: var(--st-primary);
          }

          &__label {
            font-size: 12px;
            color: #666;
          }
        }

        .profile-form-container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .profile-form {
          &__actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid var(--st-border);
          }
        }

        .profile-section {
          margin-bottom: 32px;

          &:last-child {
            margin-bottom: 0;
          }

          &__title {
            margin: 0 0 20px;
            font-size: 18px;
            font-weight: 600;
            color: var(--st-text-primary);
            padding-bottom: 12px;
            border-bottom: 1px solid var(--st-border);
          }
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;

          @media (max-width: 600px) {
            grid-template-columns: 1fr;
          }
        }

        .profile-field {
          &--full {
            grid-column: 1 / -1;
          }
        }

        .profile-textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid var(--st-border);
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.2s;

          &:focus {
            outline: none;
            border-color: var(--st-primary);
          }

          &:disabled {
            background-color: #f5f5f5;
            cursor: not-allowed;
          }
        }

        .password-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .password-form {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;

          @media (max-width: 768px) {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;