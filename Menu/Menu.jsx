import React, { useEffect, useRef, useState } from 'react'
import './Menu.css'
import { Link, NavLink, useLocation } from 'react-router-dom'
const Menu = ({menuTitle, menulinks,className,toggle,defaultOpen}) => {
                console.log(menulinks)
  let location = useLocation();
  let [toggleMenuOpen, setToggleMenuOpen] = useState(false);
  let toggleMenuRef= useRef();

  let toggleMenu = () =>{
    if(toggleMenuOpen)
    {
      setToggleMenuOpen(false)
    }
    else{
      setToggleMenuOpen(true)
    }
  }


  return (
    <div className={className ? `menu ${className}`: "menu"}>

      {menuTitle && <p ref={toggleMenuRef} 
      className={toggleMenuOpen ? "menu-toggle-btn open" : "menu-toggle-btn"}
      onClick={toggleMenu}>
        <strong>
        { menuTitle }
        </strong>
         {(toggle=='true') && <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z"/></svg></span>}
        </p>}

        <ul>
        {
          
        menulinks.map(({ url, title, submenu }, index) => 
  submenu && submenu.length > 0 ? (
    <li key={index} className={location.pathname === url ? "active" : ""}>
      <NavLink to={url} className="menu-link">
        {title}
      </NavLink>
      <ul className="submenu">
        {
          submenu.map(({title,url, submenuIndex}) => (
            <li key={submenuIndex}>
              <NavLink to={url} className="submenu-link">
                {title}
              </NavLink>
            </li>
          ))
        }
      </ul>
    </li>
  ) : (
    <li key={index} className={location.pathname === url ? "active" : ""}>
      <NavLink to={url} className="menu-link">
        {title}
      </NavLink>
    </li>
  )
)
        }
      </ul>

    </div>
  )
}

export default Menu
