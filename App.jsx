import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import { createContext, useState } from 'react';
import siteLogoImg from './assets/images/logo.svg';
export let basicSettingsContext = createContext();
function App() {

// let [siteSettings, setSiteSettings] = useState({
//                 siteName: 'Visit Copenhagen',
//                 siteLogo: siteLogoImg,
//                 primaryEmailId: 'yash@drupalchamp.org',
//                 facebookUrl: '/',
//                 instagramUrl: '/',
//                 'youtubeUrl': '/',
//         });


let location = useLocation();
  return (
    <basicSettingsContext.Provider value={{  }}>

      {
        (!location.pathname.includes('/admin')) && <Header />
      }

      <main className='main-content'>
        <Outlet />
      </main>
      {
        (!location.pathname.includes('/admin')) && <Footer />
      }
      
    </basicSettingsContext.Provider>
  )
}

export default App
