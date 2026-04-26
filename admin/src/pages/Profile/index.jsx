import React, { useEffect, useState } from "react";
import Button from "../../components/Buttons";
import Input from "../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "@Store/slices/authSlice";
import { Form, Formik } from "formik";
import "./styles.scss"

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth?.user);

  console.log({ profile });

  useEffect(() => {
    dispatch(getProfile())
  }, [])

  const handleSubmit = (values, action) => {
    console.log({ values });
  }

  return (
    <Formik
      className="st-layout--content"
      onSubmit={handleSubmit}
      initialValues={{
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        image: profile?.image || "",
        address: profile?.address || "",
        password: "",
      }}
    >
      {({ values, dirty, isSubmitting }) => {
        let data = profile?.createdAt;
        let date = new Date(data);

        let formatted = date.toLocaleString('en-US', {
          month: 'long',
          year: 'numeric'
        });

        let result = `Member since ${formatted}`;
        console.log(values);
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
                  <div className="st-form--group">
                    <Input
                      label="Old Password"
                      name="password"
                      type="text"
                      placeholder="Enter your password"
                    />
                    <Input
                      label="New Password"
                      name="new_password"
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