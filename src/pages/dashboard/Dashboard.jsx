import React, { useEffect, useState } from "react";
import DoctorDashboard from "./_components/DoctorDashboard/DoctorDashboard";
import PatientDashboard from "./_components/PatientDashboard/PatientDashboard";

const Dashboard = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  useEffect(() => {
    const LoggedInUser = JSON.parse(localStorage.getItem("user"));
    setAuthenticatedUser(LoggedInUser);
  }, []);

  // console.log("Authenticated User ==>", authenticatedUser);

  return (
    <div className="min-h-screen">
      {authenticatedUser?.role === "doctor" && <DoctorDashboard />}
      {authenticatedUser?.role === "patient" && <PatientDashboard />}
    </div>
  );
};

export default Dashboard;
