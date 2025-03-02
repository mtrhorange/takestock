import React, { useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import StarIcon from '@mui/icons-material/Star'; // Using Star as a placeholder icon
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

// export const EntitiesMenu = () => (
//   <NavDropdown
//     icon="th-list"
//     name={translate('global.menu.entities.main')}
//     id="entity-menu"
//     data-cy="entity"
//     style={{ maxHeight: '80vh', overflow: 'auto' }}
//   >
//     <EntitiesMenuItems />
//   </NavDropdown>
// );

export const EntitiesMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { name: 'product', path: '/product' },
    { name: 'userActivity', path: '/user-activity' },
    { name: 'address', path: '/address' },
    { name: 'order', path: '/order' },
    { name: 'orderItem', path: '/order-item' },
    { name: 'payment', path: '/payment' },
  ];

  return (
    <>
      {/* Icon Button to Open Menu */}
      <IconButton color="inherit" onClick={handleClick}>
        <MenuIcon style={{ color: 'white' }} />
        <Typography sx={{ color: 'white', px: 2, py: 1, fontWeight: 'bold' }}>{translate('global.menu.entities.main')}</Typography>
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { maxHeight: '80vh', overflowY: 'auto', width: 250 }, // Similar to JHipster's style
        }}
      >
        {menuItems.map(item => (
          <MenuItem key={item.name} component={Link} to={item.path} onClick={handleClose}>
            <ListItemIcon>
              <StarIcon fontSize="small" /> {/* Replace with appropriate icons */}
            </ListItemIcon>
            <Translate contentKey={`global.menu.entities.${item.name}`} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
