import './App.css';
import React, { useEffect, useState } from 'react';
import { Index } from './app/routes';
import SplashScreen from './app/shared/splashScreen/SplashScreen';

function App() {

  const [showSplash] = useState(true);

  useEffect(() => {
    const firstVisit = localStorage.getItem('firstVisit');

    if (!firstVisit) {
      localStorage.setItem('firstVisit', 'true');
    }
  }, []);

  return (
    <div className="App animate__animated animate__fadeIn animate__delay-1s animate__faster">
      {showSplash && <SplashScreen/>}
      <Index />
    </div>
  );
}

export default App;
