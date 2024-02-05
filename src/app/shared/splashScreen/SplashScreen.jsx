import LogoToptec from '../../../assets/images/logo-toptec.png';
import LogoBios from '../../../assets/images/logo-bios.png';
import './SplashScreen.css'
import 'animate.css'
import React, { useState, useEffect } from 'react';

export default function SplashScreen() {

  // Código que el Splashscreen ejecute la animación animate__fadeIn pasados 5 segundos

  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []); // El segundo argumento [] asegura que el efecto se ejecute solo una vez al montar el componente

  return (
    <React.Fragment>
      <div className={`splash-screen ${showAnimation ? 'animate__animated slideUp' : 'animate__animated animate__fadeIn'}`}>
        <div className='row'>
          <div className='col-12 d-flex flex-column justify-content-center align-items-center align-self-center'>
            <img className='logo-toptec-splashscreen- mb-2' src={LogoToptec} alt="logo-toptec" />
            <h3 className="m-0 p-0 lh-sm fs-2- font-oswald-regular- text-uppercase text-center fw-bold tx-primary-blue- le-spacing-1-">Predicción de fallas</h3>
          </div>
        </div>
        <div className='d-flex flex-column justify-content-center align-items-center align-self-center wrapper-footer-'>
          <div className='w-100 d-flex flex-column justify-content-center align-items-center align-self-center'>
            <img className='logo-bios-landing-' src={LogoBios} alt="logo-bios" />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
