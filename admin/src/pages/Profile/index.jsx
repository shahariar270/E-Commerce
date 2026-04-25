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
      }}
    >
      {({ values, dirty, isSubmitting }) => (
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

          <div className="st-profile--main">
            <div className="st-page--main__edit">

            </div>
            <div className="st-page--main__address">

            </div>

          </div>

        </Form>
      )}
    </Formik>
  );
};

export default Profile;