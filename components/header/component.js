import React from 'react';
import HeaderMenu from './menu';

const Header = () => {
  return (
    <header>
      <div className="header">
        <div className="header__logo">
          <img
            className="logo"
            src={`${process.env.BASE_PATH ?? ''}/images/mongabay-logo-white.png`}
            alt="Mongabay"
          />
        </div>
        <div className="header__content">
          <p className="header__content__name">Fire Weather Almanac</p>
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
