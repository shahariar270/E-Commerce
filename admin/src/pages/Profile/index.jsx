import React, { useEffect, useState } from "react";
import Button from "../../components/Buttons";
import Input from "../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "@Store/slices/authSlice";
import { Form, Formik } from "formik";

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
      }}
    >
      {({ values, handleChange, handleSubmit }) => (
        <Form className="st-profile">
          <div className="st-page__header">
            <div className="st-page__title">
              <h2>Profile</h2>
              <p>Manage your personal information and account settings</p>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Profile;