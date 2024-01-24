import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "../landing/Landing";
import { AnalyticsRoutes } from "../analytics/AnalyticsRoutes";

export const Index = () => {
  return (
    <React.Fragment>
      <Routes>
          <Route path="" element={ <Navigate to="landing" /> }/>
          <Route path="/" element={ <Navigate to="landing" /> }/>
          <Route path="landing" element={<Landing/>}></Route>
          <Route path="analytics/*" element={<AnalyticsRoutes/>}></Route>
      </Routes>
    </React.Fragment>
  );
}