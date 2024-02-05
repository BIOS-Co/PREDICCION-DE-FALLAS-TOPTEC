import './App.css';
import LogoBios from './assets/images/logo-bios.png';
import React, { useEffect, useState } from 'react';
import { Index } from './app/routes';
import SplashScreen from './app/shared/splashScreen/SplashScreen';

function App() {

  // Código que guarda en local storage la primera vista para que se ejecute la animación solo una vez

  const [showSplash] = useState(true);

  useEffect(() => {
    const firstVisit = localStorage.getItem('firstVisit');

    if (!firstVisit) {
      localStorage.setItem('firstVisit', 'true');
    }
  }, []);

  // Código para que una vez se cargue la animación se elimine todas las clases que conlleva realizarla

  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    const onAnimationEnd = () => {
      setAnimationFinished(true);
    };

    // Agregar el evento de finalización de la animación al montar el componente
    document.querySelector('.container-fluid').addEventListener('animationend', onAnimationEnd);

    // Iniciar la animación al montar el componente
    document.querySelector('.container-fluid').classList.add('animate__animated', 'animate__fadeIn', 'animate__delay-1s', 'animate__faster');

    // Eliminar el evento al desmontar el componente para evitar fugas de memoria
    return () => {
      document.querySelector('.container-fluid').removeEventListener('animationend', onAnimationEnd);
    };
    
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar el componente

  return (
    <div className={`App ${animationFinished ? '' : 'animate__animated animate__fadeIn animate__delay-1s animate__faster'}`}>
      {showSplash && <SplashScreen/>}
      <Index />
      <div className='d-flex flex-column justify-content-center align-items-center align-self-center wrapper-footer-'>
        <div className='w-100 d-flex flex-column justify-content-center align-items-center align-self-center'>
          <img className='logo-bios-landing-' src={LogoBios} alt="logo-bios" />
        </div>
      </div>
    </div>
  );
}

export default App;
