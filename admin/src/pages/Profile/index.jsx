import React, { useEffect, useState } from "react";
import Button from "../../components/Buttons";
import Input from "../../components/Input";
import ImageUpload from "../../components/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateProfile } from "@Store/slices/auth/authSlice";
import { getUserOrders } from "@Store/slices/orderSlice";
import { Form, Formik } from "formik";
import "./styles.scss"
import SubHeading from "@Component/SubHeading";
import Tooltip from "@Component/Tooltip";
import SEO from "@Component/SEO";

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth?.user);
  const orderCount = useSelector((state) => state.order?.pagination?.total);
  const [hasProfileFetched, setHasProfileFetched] = useState(false);
  const [hasOrdersFetched, setHasOrdersFetched] = useState(false);

  useEffect(() => {
    // Only fetch profile if we haven't fetched it yet
    if (!hasProfileFetched) {
      dispatch(getProfile()).then(() => setHasProfileFetched(true));
    }
  }, [dispatch, hasProfileFetched])

  useEffect(() => {
    if (!hasOrdersFetched) {
      dispatch(getUserOrders()).then(() => setHasOrdersFetched(true));
    }
  }, [dispatch, hasOrdersFetched])

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
        remove_image: false,
        new_pass: "",
        current_pass: "",
        conform_pass: "",
        address_name: profile?.saved_address?.name || "",
        address_phone: profile?.saved_address?.phone || "",
        address_line: profile?.saved_address?.address || "",
        address_city: profile?.saved_address?.city || "",
        address_postal_code: profile?.saved_address?.postalCode || "",
      }}
    >
      {({ values, dirty, isSubmitting, setFieldValue }) => {
        let data = profile?.createdAt;
        let date = new Date(data);

        let formatted = date.toLocaleString('en-US', {
          month: 'long',
          year: 'numeric'
        });

        let result = `Member since ${formatted} · ${orderCount || 0} order${orderCount === 1 ? '' : 's'} placed`;

        return (
          <Form className="st-profile">
            <SEO title="My Profile" description="Manage your personal information and account settings." noindex />
            <SubHeading
              title="Profile"
              subtitle="Manage your personal information and account settings"
              rightContent={
                <Tooltip content="Save all changes made to your profile" position="bottom">
                  <Button label="Save Changes" type="submit" disabled={!dirty || isSubmitting} />
                </Tooltip>
              }
            />
            <div className="st-profile__top">
              <div className="st-profile__upload">
                <ImageUpload
                  // label="Profile picture"
                  previewSrc={values.image}
                  onFileSelect={(file) => {
                    setFieldValue('profile_image', file);
                    setFieldValue('image', URL.createObjectURL(file));
                    setFieldValue('remove_image', false);
                  }}
                  onRemove={() => {
                    setFieldValue('profile_image', null);
                    setFieldValue('image', '');
                    setFieldValue('remove_image', true);
                  }}
                />
              </div>

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
                <p className="st-profile__address-hint">
                  Save a default shipping address to have it pre-filled at checkout.
                </p>
                <div className="st-profile--main__field">
                  <div className="st-form--group">
                    <Input
                      label="Full Name"
                      name="address_name"
                      type="text"
                      placeholder="Enter the recipient's name"
                    />
                    <Input
                      label="Phone"
                      name="address_phone"
                      type="text"
                      placeholder="01712345678"
                    />
                  </div>
                  <div className="">
                    <Input
                      label="Address"
                      name="address_line"
                      type="text"
                      placeholder="House, road, area, thana/upazila"
                    />
                  </div>
                  <div className="st-form--group">
                    <Input
                      label="City"
                      name="address_city"
                      type="text"
                      placeholder="Dhaka"
                    />
                    <Input
                      label="Postal Code"
                      name="address_postal_code"
                      type="text"
                      placeholder="1207"
                    />
                  </div>
                </div>
              </div>

            </div>

          </Form>
        )
      }}

    </Formik>
  );
};

export default Profile;