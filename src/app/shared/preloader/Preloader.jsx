import './Preloader.css'
import React from 'react'

export default function Preloader() {
  return (
    <React.Fragment>
      <div id="preloader-wrapper">
        <div className='w-auto d-flex flex-column justify-content-center align-items-center align-self-center'>
          <div id="preloader" className='preloader'>
            <div class="loader">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className='txt-loading'>
            <span data-text-preloader="C" className='letters-loading'>
              C
            </span>
            <span data-text-preloader="A" className='letters-loading'>
              A
            </span>
            <span data-text-preloader="R" className='letters-loading'>
              R
            </span>
            <span data-text-preloader="G" className='letters-loading'>
              G
            </span>
            <span data-text-preloader="A" className='letters-loading'>
              A
            </span>
            <span data-text-preloader="N" className='letters-loading'>
              N
            </span>
            <span data-text-preloader="D" className='letters-loading'>
              D
            </span>
            <span data-text-preloader="O" className='letters-loading'>
              O
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
