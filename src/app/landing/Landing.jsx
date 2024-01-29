import './Landing.css'
import LogoToptec from '../../assets/images/logo-toptec.png';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import Preloader from '../shared/preloader/Preloader';
import Swal from 'sweetalert2';

export default function Landing() {

  /* useEffect(() => {
    Swal.fire({
      icon: "error",
      title: "Titulo de prueba",
      text: "Esto es un texto de prueba para validar como se ve esta alerta"
    });
  }, []); */

  /* INTERNAL NAVIGATION */

  const navigate = useNavigate();

  const RedirectDataUpload = () => {
    navigate('/analytics/dataUpload');
  }

  const RedirectDataHistory = () => {
    navigate('/analytics/dataHistory');
  }

  return (
    <React.Fragment>
      {/* <Preloader></Preloader> */}
      <div className='container-fluid vw-100 min-h- p-0 position-relative ps-2 pe-2 ps-sm-2 pe-sm-2 ps-md-3 pe-md-3 ps-lg-4 pe-lg-4 ps-xl-4 pe-xl-4 ps-xxl-4 pe-xxl-4 animate__animated animate__fadeIn animate__faster'>
        <div className='row mb-4'>
          <div className='col-12'>
            <nav className='navbar navbar-expand pt-0 pb-0 d-flex flex-row justify-content-end align-items-center align-self-center navbar-bg-clip-path-'>
              <div className='container-fluid position-relative d-flex flex-row justify-content-between align-items-center align-self-center p-2'>
                <div className='navbar-brand d-flex flex-row justify-content-start align-items-center align-self-center'>
                  <img className='logo-toptec-landing-' src={LogoToptec} alt="logo-toptec" />
                </div>
              </div>
            </nav>
          </div>
        </div>
        <div className='row mt-4 mb-4'>
          <div className='col-12'>
            <h3 className="m-0 p-0 lh-sm fs-1- font-oswald-regular- text-uppercase text-center fw-bold tx-primary-blue- le-spacing-1-">Predicción de fallas</h3>
          </div>
        </div>
        <div className='row mt-4 mb-4 wrapper-buttons-landing-'>
          <div className='col-12'>
            <div className="row gx-2 d-flex flex-row justify-content-center align-items-center align-self-center">
              <div className="col-auto p-3">
                <button type='button' className="btn-upload- d-flex flex-column justify-content-center align-items-center align-self-center" onClick={ RedirectDataUpload }><FontAwesomeIcon className='mb-2' icon={faArrowUpFromBracket} size="2xl"/>
                  <span>Cargar datos</span></button>
              </div>
              <div className="col-auto p-3">
                <button type='button' className="btn-history- d-flex flex-column justify-content-center align-items-center align-self-center" onClick={ RedirectDataHistory }>
                  <FontAwesomeIcon className='mb-2' icon={faClockRotateLeft} size="2xl"/>
                  <span>Histórico</span></button>
              </div>
            </div>
          </div>
        </div>
        <div className='row mt-4 mb-4 wrapper-footer-'>
          <div className='col-12'>
            <h3 className="m-0 p-0 lh-base fs-6- font-oswald-regular- text-uppercase text-center fw-bold tx--quaternary-gray- le-spacing-1-">Diseñado por el Centro de Desarrollo Tecnológico - BIOS</h3>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
