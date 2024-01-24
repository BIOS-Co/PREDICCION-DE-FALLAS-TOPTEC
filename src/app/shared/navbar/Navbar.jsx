import './Navbar.css'
import LogoToptec from '../../../assets/images/logo-toptec.png';
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';


export default function Navbar() {

  /* INTERNAL NAVIGATION */

  const navigate = useNavigate();

  const RedirectLanding = () => {
    navigate('/landing');
  }

  return (
    <React.Fragment>
      <div className='row mb-5'>
        <div className='col-12'>
          {/* <nav className='navbar navbar-expand-lg fixed-top pt-0 pb-0 d-flex flex-row justify-content-end align-items-center align-self-center mb-5 navbar-bg-clip-path-'>
            <div className='container-fluid position-relative d-flex flex-row justify-content-between align-items-center align-self-center'>
              <div className='navbar-brand d-flex flex-row justify-content-start align-items-center align-self-center'>
                <img className='navbar-logo-toptec-' src={LogoToptec} alt="logo-toptec" />
              </div>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className='collapse navbar-collapse justify-content-end' id="navbarNav">
                <ul className='navbar-nav row row-cols-auto g-2 d-flex flex-wrap flex-row justify-content-center justify-content-sm-center justify-content-md-center justify-content-lg-center justify-content-xl-center justify-content-xxl-center align-items-center align-self-center align-items-sm-center align-self-sm-center align-items-md-center align-self-md-center align-items-lg-center align-self-lg-center align-items-xl-center align-self-xl-center align-items-xxl-center align-self-xxl-center mt-2 mt-sm-2 mt-md-0 mt-lg-0 mt-xl-0 mt-xxl-0'>
                  <li className='nav-item mt-0 ps-1 pe-1 ps-sm-1 pe-sm-1 ps-md-1 pe-md-1 ps-lg-2 pe-lg-2 ps-xl-2 pe-xl-2 ps-xxl-2 pe-xxl-2'>
                    <NavLink className='nav-link ps-4 pe-4 h-45-' style={({ isActive }) => ({ color: isActive ? 'var(--color-primary-red-)' : 'var(--color-primary-black-)', borderTop: isActive ? '2px solid var(--color-primary-red-)' : '2px solid transparent', fontWeight: isActive ? 'bold' : 'bold', })} to='/landing'><span className='lh-1 le-spacing-05 fs-4- font-oswald-regular-'>Inicio</span>
                    </NavLink>
                  </li>
                  <li className='nav-item mt-0 ps-2 pe-2 ps-sm-2 pe-sm-2 ps-md-2 pe-md-2 ps-lg-2 pe-lg-2 ps-xl-2 pe-xl-2 ps-xxl-2 pe-xxl-2'>
                    <NavLink className='nav-link ps-4 pe-4 h-45-' style={({ isActive }) => ({ color: isActive ? 'var(--color-primary-red-)' : 'var(--color-primary-black-)', borderTop: isActive ? '2px solid var(--color-primary-red-)' : '2px solid transparent', fontWeight: isActive ? 'bold' : 'bold', })} to='/analytics/dataUpload'><span className='lh-1 le-spacing-05 fs-4- font-oswald-regular-'>Cargar datos</span>
                    </NavLink>
                  </li>
                  <li className='nav-item mt-0 ps-2 pe-2 ps-sm-2 pe-sm-2 ps-md-2 pe-md-2 ps-lg-2 pe-lg-2 ps-xl-2 pe-xl-2 ps-xxl-2 pe-xxl-2'>
                    <NavLink className='nav-link ps-4 pe-4 h-45-' style={({ isActive }) => ({ color: isActive ? 'var(--color-primary-red-)' : 'var(--color-primary-black-)', borderTop: isActive ? '2px solid var(--color-primary-red-)' : '2px solid transparent', fontWeight: isActive ? 'bold' : 'bold', })} to='/analytics/dataHistory'><span className='lh-1 le-spacing-05 fs-4- font-oswald-regular-'>Histórico</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </nav> */}
          <nav className='navbar navbar-expand pt-0 pb-0 d-flex flex-row justify-content-end align-items-center align-self-center navbar-bg-clip-path-'>
            <div className='container-fluid navbar-collapse-background position-relative d-flex flex-row justify-content-between align-items-center align-self-center p-2'>
              <div className='navbar-brand d-flex flex-row justify-content-start align-items-center align-self-center'>
                <img className='navbar-logo-toptec-' src={LogoToptec} alt="logo-toptec" />
              </div>
              <div className='row'>
                <div className='col-auto ps-4 pe-4'>
                  {/* <button type='button' className="button-background-move-back-to- d-flex flex-row justify-content-center align-items-center align-self-center" onClick={ RedirectLanding }>Volver</button> */}
                  <button type='button' className="btn-neumorphic- btn-secondary-blue- back-to- rounded-circle d-flex flex-row justify-content-center align-items-center align-self-center" onClick={ RedirectLanding }><FontAwesomeIcon icon={faChevronLeft} size="md"/></button>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </React.Fragment>
  )
}
