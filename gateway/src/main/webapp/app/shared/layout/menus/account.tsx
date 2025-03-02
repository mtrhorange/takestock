import React, { useState } from 'react';
import { Translate } from 'react-jhipster';
import { IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Lock as LockIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';

// const accountMenuItemsAuthenticated = () => (
//   <>
//     <MenuItem icon="wrench" to="/account/settings" data-cy="settings">
//       <Translate contentKey="global.menu.account.settings">Settings</Translate>
//     </MenuItem>
//     <MenuItem icon="lock" to="/account/password" data-cy="passwordItem">
//       <Translate contentKey="global.menu.account.password">Password</Translate>
//     </MenuItem>
//     <MenuItem icon="sign-out-alt" to="/logout" data-cy="logout">
//       <Translate contentKey="global.menu.account.logout">Sign out</Translate>
//     </MenuItem>
//   </>
// );

// const accountMenuItems = () => (
//   <>
//     <MenuItem id="login-item" icon="sign-in-alt" to="/login" data-cy="login">
//       <Translate contentKey="global.menu.account.login">Sign in</Translate>
//     </MenuItem>
//     <MenuItem icon="user-plus" to="/account/register" data-cy="register">
//       <Translate contentKey="global.menu.account.register">Register</Translate>
//     </MenuItem>
//   </>
// );

// export const AccountMenu = ({ isAuthenticated = false }) => (
//   <NavDropdown icon="user" name={translate('global.menu.account.main')} id="account-menu" data-cy="accountMenu">
//     {isAuthenticated && accountMenuItemsAuthenticated()}
//     {!isAuthenticated && accountMenuItems()}
//   </NavDropdown>
// );

export const AccountMenu = ({ isAuthenticated = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const authenticatedMenuItems = [
    { name: 'settings', path: '/account/settings', icon: <SettingsIcon />, dataCy: 'settings' },
    { name: 'password', path: '/account/password', icon: <LockIcon />, dataCy: 'passwordItem' },
    { name: 'logout', path: '/logout', icon: <ExitToAppIcon />, dataCy: 'logout' },
  ];

  const unauthenticatedMenuItems = [
    { name: 'login', path: '/login', icon: <LoginIcon />, dataCy: 'login' },
    { name: 'register', path: '/account/register', icon: <PersonAddIcon />, dataCy: 'register' },
  ];

  return (
    <>
      {/* Account Menu Button */}
      <IconButton color="inherit" onClick={handleClick}>
        <AccountCircleIcon style={{ color: 'white' }} />
        <Typography sx={{ color: 'white', px: 2, py: 1, fontWeight: 'bold' }}>
          <Translate contentKey="global.menu.account.main" />
        </Typography>
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { maxHeight: '80vh', overflowY: 'auto', width: 250 },
        }}
      >
        {isAuthenticated &&
          authenticatedMenuItems.map(item => (
            <MenuItem key={item.name} component={Link} to={item.path} data-cy={item.dataCy} onClick={handleClose}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <Translate contentKey={`global.menu.account.${item.name}`} />
            </MenuItem>
          ))}

        {!isAuthenticated &&
          unauthenticatedMenuItems.map(item => (
            <MenuItem key={item.name} component={Link} to={item.path} data-cy={item.dataCy} onClick={handleClose}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <Translate contentKey={`global.menu.account.${item.name}`} />
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};

export default AccountMenu;
