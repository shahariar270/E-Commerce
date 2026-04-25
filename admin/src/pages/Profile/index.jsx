import React, { useEffect, useState } from "react";
import Button from "../../components/Buttons";
import Input from "../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "@Store/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth?.user);

console.log({profile});

  useEffect(() => {
    dispatch(getProfile())
  }, [])





  return (
    <div className="st-layout--content">
      <div className="st-page__header">
        <div className="st-page__title">
          <h2>Profile</h2>
          <p>Manage your personal information and account settings</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;