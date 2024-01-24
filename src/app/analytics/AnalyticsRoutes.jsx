import './Analytics.css'
import React from 'react'
import { Navigate, Route, Routes } from "react-router-dom"
import DataUpload from './dataUpload/DataUpload'
import DataHistory from './dataHistory/DataHistory'
import Navbar from '../shared/navbar/Navbar'

export const AnalyticsRoutes = () => {
  return (
    <React.Fragment>
      <div className='container-fluid vw-100 min-h- overflow-x-hidden p-0 ps-4 pe-4'>
        <Navbar></Navbar>
        <Routes>
            <Route path="" element={ <Navigate to="dataUpload" /> }/>
            <Route path="dataUpload" element={<DataUpload/>} />
            <Route path="dataHistory" element={<DataHistory/>} />
        </Routes>
      </div>
    </React.Fragment>
  )
}