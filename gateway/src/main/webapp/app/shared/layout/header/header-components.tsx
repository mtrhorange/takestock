import React from 'react';
import { Translate } from 'react-jhipster';
import { Home as HomeIcon } from '@mui/icons-material';
import { NavItem, NavLink, NavbarBrand } from 'reactstrap';
import { NavLink as Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@mui/material';
import { useSearch } from 'app/context/searchContext';

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="content/images/logo-jhipster.png" alt="Logo" />
  </div>
);

export const Brand = () => (
  <NavbarBrand tag={Link} to="/" className="brand-logo">
    <BrandIcon />
    <span className="brand-title">
      <Translate contentKey="global.title">Gateway</Translate>
    </span>
    <span className="navbar-version">{VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`}</span>
  </NavbarBrand>
);

export const Home = () => {
  const { setSearchTerm } = useSearch();
  const navigate = useNavigate();

  const onClick = () => {
    setSearchTerm('');
    navigate('/home');
  };

  return (
    // <NavItem>
    <NavLink onClick={onClick} className="d-flex align-items-center">
      {/* <FontAwesomeIcon icon="home" /> */}
      <HomeIcon style={{ color: 'white' }} />
      <span>
        <Typography variant="h6" style={{ color: 'white', paddingLeft: '10px' }}>
          eCommerce Store
        </Typography>
        {/* <Translate contentKey="global.menu.home">Home</Translate> */}
      </span>
    </NavLink>
    // </NavItem>
  );
};
