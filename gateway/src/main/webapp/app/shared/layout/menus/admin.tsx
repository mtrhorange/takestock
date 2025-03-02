import React, { useState } from 'react';
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  Favorite as FavoriteIcon,
  People as PeopleIcon,
  Build as BuildIcon,
  List as ListIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import { Translate } from 'react-jhipster';
import { IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

// const adminMenuItems = () => (
//   <>
//     <MenuItem icon="road" to="/admin/gateway">
//       <Translate contentKey="global.menu.admin.gateway">Gateway</Translate>
//     </MenuItem>
//     <MenuItem icon="users" to="/admin/user-management">
//       <Translate contentKey="global.menu.admin.userManagement">User management</Translate>
//     </MenuItem>
//     <MenuItem icon="tachometer-alt" to="/admin/metrics">
//       <Translate contentKey="global.menu.admin.metrics">Metrics</Translate>
//     </MenuItem>
//     <MenuItem icon="heart" to="/admin/health">
//       <Translate contentKey="global.menu.admin.health">Health</Translate>
//     </MenuItem>
//     <MenuItem icon="cogs" to="/admin/configuration">
//       <Translate contentKey="global.menu.admin.configuration">Configuration</Translate>
//     </MenuItem>
//     <MenuItem icon="tasks" to="/admin/logs">
//       <Translate contentKey="global.menu.admin.logs">Logs</Translate>
//     </MenuItem>
//     {/* jhipster-needle-add-element-to-admin-menu - JHipster will add entities to the admin menu here */}
//   </>
// );

// const openAPIItem = () => (
//   <MenuItem icon="book" to="/admin/docs">
//     <Translate contentKey="global.menu.admin.apidocs">API</Translate>
//   </MenuItem>
// );

// export const AdminMenu = ({ showOpenAPI }) => (
//   <NavDropdown icon="users-cog" name={translate('global.menu.admin.main')} id="admin-menu" data-cy="adminMenu">
//     {adminMenuItems()}
//     {showOpenAPI && openAPIItem()}
//   </NavDropdown>
// );

export const AdminMenu = ({ showOpenAPI }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { name: 'gateway', path: '/admin/gateway', icon: <SettingsIcon /> },
    { name: 'userManagement', path: '/admin/user-management', icon: <PeopleIcon /> },
    { name: 'metrics', path: '/admin/metrics', icon: <SpeedIcon /> },
    { name: 'health', path: '/admin/health', icon: <FavoriteIcon /> },
    { name: 'configuration', path: '/admin/configuration', icon: <BuildIcon /> },
    { name: 'logs', path: '/admin/logs', icon: <ListIcon /> },
  ];

  return (
    <>
      {/* Admin Menu Button */}
      <IconButton color="inherit" onClick={handleClick}>
        <AdminPanelSettingsIcon style={{ color: 'white' }} />
        <Typography sx={{ color: 'white', px: 2, py: 1, fontWeight: 'bold' }}>
          <Translate contentKey="global.menu.admin.main" />
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
        {menuItems.map(item => (
          <MenuItem key={item.name} component={Link} to={item.path} onClick={handleClose}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <Translate contentKey={`global.menu.admin.${item.name}`} />
          </MenuItem>
        ))}

        {showOpenAPI && (
          <MenuItem component={Link} to="/admin/docs" onClick={handleClose}>
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <Translate contentKey="global.menu.admin.apidocs">API</Translate>
          </MenuItem>
        )}

        {/* JHipster Needle - Add Admin Menu Items Here */}
      </Menu>
    </>
  );
};

export default AdminMenu;
