import './Analytics.css'
import LogoBios from '../../assets/images/logo-bios.png';
import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes } from "react-router-dom"
import DataUpload from './dataUpload/DataUpload'
import DataHistory from './dataHistory/DataHistory'
import Navbar from '../shared/navbar/Navbar'

export const AnalyticsRoutes = () => {
  const [animationFinished, setAnimationFinished] = useState(false);

  // Utilizar useRef para referenciar el elemento
  const containerRef = useRef(null);

  useEffect(() => {
    const onAnimationEnd = () => {
      setAnimationFinished(true);
    };

    const containerElement = containerRef.current;

    if (containerElement) {
      containerElement.addEventListener('animationend', onAnimationEnd);

      // Iniciar la animación al montar el componente
      containerElement.classList.add(
        'animate__animated',
        'animate__fadeIn',
        'animate__faster'
      );

      // Eliminar el evento al desmontar el componente
      return () => {
        // Verificar nuevamente que el elemento y el evento existan antes de quitar el evento
        const containerElement = containerRef.current;

        if (containerElement) {
          containerElement.removeEventListener('animationend', onAnimationEnd);
        }
      };
    }
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar el componente

  return (
    <React.Fragment>
      <div
        ref={containerRef}
        className={`container-fluid vw-100 min-h- overflow-x-hidden p-0 ps-2 pe-2 ps-sm-2 pe-sm-2 ps-md-3 pe-md-3 ps-lg-4 pe-lg-4 ps-xl-4 pe-xl-4 ps-xxl-4 pe-xxl-4 ${
          animationFinished
            ? ''
            : 'animate__animated animate__fadeIn animate__faster'
        }`}
      >
        <Navbar />
        <Routes>
          <Route path="" element={<Navigate to="dataUpload" />} />
          <Route path="dataUpload" element={<DataUpload />} />
          <Route path="dataHistory" element={<DataHistory />} />
        </Routes>
      </div>
    </React.Fragment>
  );
};
