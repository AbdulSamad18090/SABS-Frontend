import React, { useEffect, useState } from "react";
import DoctorProfile from "./DoctorProfile/DoctorProfile";
import PatientProfile from "./PatientProfile/PatientProfile";

const Profile = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    const logineduser = JSON.parse(localStorage.getItem("user"));
    setAuthenticatedUser(logineduser);
  }, []);

  return (
    <div className="min-h-screen">
      {authenticatedUser?.role === "doctor" && <DoctorProfile />}
      {authenticatedUser?.role === "patient" && <PatientProfile />}
    </div>
  );
};

export default Profile;
