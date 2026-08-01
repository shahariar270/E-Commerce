import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Buttons";
import Input from "../../components/Input";
import SubHeading from "@Component/SubHeading";
import SEO from "@Component/SEO";
import { getSettings, updateSettings } from "@Store/slices/settingsSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const { require_guest_email_verification, loading: settingsLoading } = useSelector((state) => state.settings);

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  const handleToggleGuestVerification = () => {
    dispatch(updateSettings({ require_guest_email_verification: !require_guest_email_verification }));
  };

  const [settings, setSettings] = useState({
    siteName: "E-commerce Admin",
    siteEmail: "admin@example.com",
    currency: "USD",
    timezone: "UTC",
    language: "en",
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="settings-page st-page">
      <SEO title="Settings" description="Configure your application preferences." noindex />
      <SubHeading
        title="Settings"
        subtitle="Configure your application preferences"
      />

      <div className="settings-section">
        <h3 className="settings-section__title">Checkout</h3>
        <div className="settings-section__content">
          <div className="settings-toggle">
            <div className="settings-toggle__info">
              <span className="settings-toggle__label">Require Guest Email Verification</span>
              <span className="settings-toggle__description">
                Guests must verify their email with a one-time code before placing an order.
                Logged-in users are unaffected — their account email is already trusted.
              </span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={require_guest_email_verification}
                disabled={settingsLoading}
                onChange={handleToggleGuestVerification}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-section">
          <h3 className="settings-section__title">General Settings</h3>
          <div className="settings-section__content">
            <div className="settings-group">
              <Input
                label="Site Name"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                type="text"
                placeholder="Enter site name"
              />
            </div>
            <div className="settings-group">
              <Input
                label="Site Email"
                name="siteEmail"
                value={settings.siteEmail}
                onChange={handleChange}
                type="email"
                placeholder="Enter site email"
              />
            </div>
            <div className="settings-group">
              <label className="input-label">Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="settings-select"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="BDT">BDT - Bangladeshi Taka</option>
              </select>
            </div>
            <div className="settings-group">
              <label className="input-label">Timezone</label>
              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                className="settings-select"
              >
                <option value="UTC">UTC</option>
                <option value="Asia/Dhaka">Asia/Dhaka</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
            <div className="settings-group">
              <label className="input-label">Language</label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="settings-select"
              >
                <option value="en">English</option>
                <option value="bn">Bangla</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-section__title">System Settings</h3>
          <div className="settings-section__content">
            <div className="settings-toggle">
              <div className="settings-toggle__info">
                <span className="settings-toggle__label">Maintenance Mode</span>
                <span className="settings-toggle__description">
                  Temporarily disable the site for maintenance
                </span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="settings-toggle">
              <div className="settings-toggle__info">
                <span className="settings-toggle__label">Allow Registration</span>
                <span className="settings-toggle__description">
                  Allow new users to register on the site
                </span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="allowRegistration"
                  checked={settings.allowRegistration}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-section__title">Notifications</h3>
          <div className="settings-section__content">
            <div className="settings-toggle">
              <div className="settings-toggle__info">
                <span className="settings-toggle__label">Email Notifications</span>
                <span className="settings-toggle__description">
                  Receive email notifications for important events
                </span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="settings-toggle">
              <div className="settings-toggle__info">
                <span className="settings-toggle__label">SMS Notifications</span>
                <span className="settings-toggle__description">
                  Receive SMS notifications for important events
                </span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="smsNotifications"
                  checked={settings.smsNotifications}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-form__actions">
          <Button
            type="submit"
            label={isSaving ? "Saving..." : "Save Settings"}
            variant="primary"
            size="lg"
            disabled={isSaving}
          />
        </div>
      </form> */}

      <style>{`
        .settings-page {
          max-width: 800px;
        }

        .settings-form__actions {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--st-border);
        }

        .settings-section {
          background: white;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .settings-section__title {
          margin: 0 0 20px;
          font-size: 18px;
          font-weight: 600;
          color: var(--st-text-primary);
          padding-bottom: 12px;
          border-bottom: 1px solid var(--st-border);
        }

        .settings-section__content {
          display: grid;
          gap: 20px;
        }

        .settings-group {
          display: flex;
          flex-direction: column;
        }

        .settings-select {
          padding: 10px 14px;
          border: 1px solid var(--st-border);
          border-radius: 4px;
          font-size: 14px;
          background: white;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .settings-select:focus {
          outline: none;
          border-color: var(--st-primary);
        }

        .settings-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          gap: 16px;
        }

        .settings-toggle__info {
          display: flex;
          flex-direction: column;
        }

        .settings-toggle__label {
          font-size: 14px;
          font-weight: 500;
          color: var(--st-text-primary);
          margin-bottom: 4px;
        }

        .settings-toggle__description {
          font-size: 12px;
          color: #666;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
          flex-shrink: 0;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-switch input:checked + .toggle-slider {
          background-color: var(--st-primary);
        }

        .toggle-switch input:checked + .toggle-slider::before {
          transform: translateX(24px);
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.3s;
          border-radius: 24px;
        }

        .toggle-slider::before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Settings;