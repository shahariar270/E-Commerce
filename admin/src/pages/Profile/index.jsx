import React, { useEffect, useState } from "react";
import Button from "../../components/Buttons";
import Input from "../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateProfile } from "@Store/slices/authSlice";
import { Form, Formik } from "formik";
import "./styles.scss"

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth?.user);

  useEffect(() => {
    dispatch(getProfile())
  }, [])

  const handleSubmit = (values, action) => {
    dispatch(updateProfile(values)).then(() => {
      action.setSubmitting(false);
    });
  }

  return (
    <Formik
      enableReinitialize
      className="st-layout--content"
      onSubmit={handleSubmit}
      validate={(values) => {
        const errors = {};

        if (values.new_password && values.confirm_password) {
          if (values.new_password !== values.confirm_password) {
            errors.confirm_password = "Passwords do not match";
          }
        }

        return errors
      }}
      initialValues={{
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        image: profile?.image || "",
        address: profile?.address || "",
        profile_image: null,
        new_pass: "",
        current_pass: "",
        conform_pass: "",
      }}
    >
      {({ values, dirty, isSubmitting, setFieldValue }) => {
        let data = profile?.createdAt;
        let date = new Date(data);

        let formatted = date.toLocaleString('en-US', {
          month: 'long',
          year: 'numeric'
        });

        let result = `Member since ${formatted}`;

        return (
          <Form className="st-profile">
            <div className="st-page__header">
              <div className="st-page__title">
                <h2>Profile</h2>
                <p>Manage your personal information and account settings</p>
              </div>
              <div className="">
                <Button label="Save Changes" type="submit" disabled={!dirty || isSubmitting} />
              </div>
            </div>
            <div className="st-profile__top">
              <img src={values?.image || 'https://dummyimage.com/600x600/eee/999&text=No+Image'} />
              <div className="st-profile__top--content">
                <h2>{`${values?.first_name}   ${values?.last_name}`}</h2>
                <li>{result}</li>
              </div>
            </div>
            <div className="st-profile__upload">
              <label className="st-label" htmlFor="profile_image">Profile picture</label>
              <input
                id="profile_image"
                name="profile_image"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) {
                    setFieldValue('profile_image', file);
                    setFieldValue('image', URL.createObjectURL(file));
                  }
                }}
              />
            </div>

            <div className="st-profile--main">
              <div className="st-page--main__edit">
                <h3>Personal Details</h3>
                <div className="st-profile--main__field">
                  <div className="st-form--group">
                    <Input
                      label="First Name"
                      name="first_name"
                      type="text"
                      placeholder="Enter your first name"
                    />
                    <Input
                      label="Last Name"
                      name="last_name"
                      type="text"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div className="">
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      disabled
                    />
                  </div>
                  <div className="st-form--group">
                    <Input
                      label="Phone"
                      name="phone"
                      type="text"
                      placeholder="Enter your phone number"
                    />
                    <Input
                      label="Address"
                      name="address"
                      type="text"
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className="">
                    <Input
                      label="Old Password"
                      name="current_pass"
                      type="text"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="st-form--group">
                    <Input
                      label="New Password"
                      name="new_pass"
                      type="text"
                      placeholder="Enter your new password"
                    />
                    <Input
                      label="Conform Password"
                      name="conform_pass"
                      type="text"
                      placeholder="Enter your new password"
                    />
                  </div>
                </div>
              </div>
              <div className="st-page--main__address">
                <h3>Address Details</h3>
                <div className="st-profile--main__field">
                  coming soon...
                </div>

              </div>

            </div>

          </Form>
        )
      }
      }

    </Formik>
  );
};

export default Profile;