import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';//importing hamburgermenu from react icons
import { AiOutlineLogout } from 'react-icons/ai';
import { BiLogOut } from 'react-icons/bi';
import { MdClose } from 'react-icons/md';
import Images from '../../Constant/Images';// importing all Images
import '../Home/Navbar.css';//importing stylesheet of Navbar

function Navbar() {
    const [toggleMenu, setToggleMenu] = useState(false);//creating state variable for mobiletoggle menu
    const location = useLocation().pathname;
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("HisabbookUser"));
    if (location !== "/login" && location !== "/register") {
        return (
            <nav className="app__navbar">
                <div className='app__navbar-logo'>
                    <img src={Images.logo} alt="app__logo" />
                </div>
                <ul className="app__navbar-links">
                    <li><NavLink activeClassName="active" to="/">Home</NavLink></li>
                    <li><NavLink activeClassName="active" to="/dashboard">Dashboard</NavLink></li>
                    <li><NavLink activeClassName="active" to="/about">Pi-Chart</NavLink></li>
                    <li><NavLink activeClassName="active" to="/contact">Contact</NavLink></li>
                    <li><NavLink activeClassName="active" to="/facereg">FaceRegister</NavLink></li>
                    <li><NavLink activeClassName="active" to="/facelog">FaceLogin</NavLink></li>
                </ul>
                <div className='username'>
                    {!user ? <p className='username1'></p> : <p className='username1'>{user.name}</p>}
                    <AiOutlineLogout className='logout' onClick={() => {
                        localStorage.removeItem('HisabbookUser');
                        navigate("/login");
                    }}>Log Out</AiOutlineLogout>
                </div>
                <div className="app__navbar-smallscreen">
                    <GiHamburgerMenu color="#fff" fontSize={27} cursor='pointer' onClick={() => setToggleMenu(true)} />
                    {toggleMenu && (
                        <div className="app__navbar-smallscreen_overlay flex__center slide-bottom">
                            <div className='lgout-dflex'>
                                <BiLogOut className='logout-small' onClick={() => {
                                    localStorage.removeItem('HisabbookUser');
                                    setToggleMenu(false);
                                    navigate("/login");
                                }}>Log Out</BiLogOut>
                                {!user ? <p className='username-small'></p> : <p className='username-small'>{user.name}</p>}
                            </div>
                            <MdClose fontSize={27} className="overlay__close" onClick={() => setToggleMenu(false)} />
                            <ul className="app__navbar-smallscreen_links">
                                <li onClick={() => setToggleMenu(false)}><NavLink to="/">Home</NavLink></li>
                                <li onClick={() => setToggleMenu(false)}><NavLink to="/dashboard">Dashboard</NavLink></li>
                                <li onClick={() => setToggleMenu(false)}><NavLink to="/about">Pi-Chart</NavLink></li>
                                <li onClick={() => setToggleMenu(false)}><NavLink to="/contact">Contact</NavLink></li>
                                <li onClick={() => setToggleMenu(false)}><NavLink to="/facereg">FaceRegister</NavLink></li>
                                <li onClick={() => setToggleMenu(false)}><NavLink to="/facelog">FaceLogin</NavLink></li>
                            </ul>
                        </div>
                    )}
                </div>
            </nav>
        );
    }
}

export default Navbar;