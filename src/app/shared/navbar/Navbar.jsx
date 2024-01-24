import './Navbar.css'
import LogoToptec from '../../../assets/images/logo-toptec.png';
import React from 'react'
import { useNavigate } from 'react-router-dom';
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
          <nav className='navbar navbar-expand pt-0 pb-0 d-flex flex-row justify-content-end align-items-center align-self-center navbar-bg-clip-path-'>
            <div className='container-fluid navbar-collapse-background position-relative d-flex flex-row justify-content-between align-items-center align-self-center p-2'>
              <div className='navbar-brand d-flex flex-row justify-content-start align-items-center align-self-center'>
                <img className='navbar-logo-toptec-' src={LogoToptec} alt="logo-toptec" />
              </div>
              <div className='row'>
                <div className='col-auto ps-4 pe-4'>
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
