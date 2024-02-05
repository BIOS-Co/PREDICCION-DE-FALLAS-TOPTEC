import './Analytics.css'
import LogoBios from '../../assets/images/logo-bios.png';
import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes } from "react-router-dom"
import DataUpload from './dataUpload/DataUpload'
import DataHistory from './dataHistory/DataHistory'
import Navbar from '../shared/navbar/Navbar'

export const AnalyticsRoutes = () => {

  // Código para que una vez se cargue la animación se elimine todas las clases que conlleva realizarla

  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    const onAnimationEnd = () => {
      setAnimationFinished(true);
    };

    // Agregar el evento de finalización de la animación al montar el componente
    document.querySelector('.container-fluid').addEventListener('animationend', onAnimationEnd);

    // Iniciar la animación al montar el componente
    document.querySelector('.container-fluid').classList.add('animate__animated', 'animate__fadeIn', 'animate__faster');

    // Eliminar el evento al desmontar el componente para evitar fugas de memoria
    return () => {
      document.querySelector('.container-fluid').removeEventListener('animationend', onAnimationEnd);
    };
    
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar el componente

  return (
    <React.Fragment>
      <div className={`container-fluid vw-100 min-h- overflow-x-hidden p-0 ps-2 pe-2 ps-sm-2 pe-sm-2 ps-md-3 pe-md-3 ps-lg-4 pe-lg-4 ps-xl-4 pe-xl-4 ps-xxl-4 pe-xxl-4 ${animationFinished ? '' : 'animate__animated animate__fadeIn animate__faster'}`}>
        <Navbar></Navbar>
        <Routes>
            <Route path="" element={ <Navigate to="dataUpload" /> }/>
            <Route path="dataUpload" element={<DataUpload/>} />
            <Route path="dataHistory" element={<DataHistory/>} />
        </Routes>
        <div className='row mt-4 mb-4 sticky-bottom'>
          <div className='col-12 d-flex flex-column justify-content-center align-items-center align-self-center'>
            <img className='logo-bios-landing-' src={LogoBios} alt="logo-bios" />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}