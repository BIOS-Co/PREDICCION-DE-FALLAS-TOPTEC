import './App.css';
import LogoBios from './assets/images/logo-bios.png';
import React, { useEffect, useState, useRef } from 'react';
import { Index } from './app/routes';
import SplashScreen from './app/shared/splashScreen/SplashScreen';

function App() {
  const [showSplash] = useState(true);
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
      containerElement.classList.add('animate__animated', 'animate__fadeIn', 'animate__delay-1s', 'animate__faster');

      // Eliminar el evento al desmontar el componente
      return () => {
        // Verificar nuevamente que el elemento y el evento existan antes de quitar el evento
        if (containerRef.current) {
          containerRef.current.removeEventListener('animationend', onAnimationEnd);
        }
      };
    }
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar el componente

  return (
    <div ref={containerRef} className={`App ${animationFinished ? '' : 'animate__animated animate__fadeIn animate__delay-1s animate__faster'}`}>
      {showSplash && <SplashScreen />}
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
