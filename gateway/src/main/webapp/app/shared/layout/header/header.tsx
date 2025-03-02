import './header.scss';

import React, { useState } from 'react';
import { Storage } from 'react-jhipster';
import { Collapse, List, Navbar } from 'reactstrap';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAppDispatch } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale';
import { AccountMenu, AdminMenu, EntitiesMenu, LocaleMenu } from '../menus';
import { Home } from './header-components';
import {
  Badge,
  Box,
  Button,
  CardMedia,
  Divider,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from 'app/context/cartContext';
import { useSearch } from 'app/context/searchContext';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  // ribbonEnv: string;
  // isInProduction: boolean;
  // isOpenAPIEnabled: boolean;
  currentLocale: string;
}

const Header = (props: IHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart(); // ✅ Access cart data anywhere!
  const { searchTerm, setSearchTerm } = useSearch();
  const [openCart, setOpenCart] = useState(false);

  const dispatch = useAppDispatch();

  const handleLocaleChange = event => {
    const langKey = event.target.value;
    Storage.session.set('locale', langKey);
    dispatch(setLocale(langKey));
  };

  // const renderDevRibbon = () =>
  // props.isInProduction === false ? (
  //   <div className="ribbon dev">
  //     <a href="">
  //       <Translate contentKey={`global.ribbon.${props.ribbonEnv}`} />
  //     </a>
  //   </div>
  // ) :
  // null;

  // const toggleMenu = () => setMenuOpen(!menuOpen);

  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm) {
      navigate('/search-results', { state: { search: searchTerm } }); // Redirect to a search results page
    }
  };

  const handleCartClick = () => {
    setSearchTerm('');
    navigate('/cart');
  };

  return (
    <div id="app-header">
      {/* {renderDevRibbon()} */}
      {/* <LoadingBar className="loading-bar" /> */}
      <Navbar data-cy="navbar" dark expand="md" fixed="top" className="jh-navbar">
        <Collapse isOpen={menuOpen} navbar>
          <Home />
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              mx: '50px', // 50px left & right margin
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
              sx={{
                backgroundColor: 'white',
                borderRadius: 1,
                maxWidth: '600px', // Prevents it from becoming too large on big screens
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', marginTop: '10px' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <IconButton
                color="inherit"
                onClick={handleCartClick}
                onMouseEnter={() => setOpenCart(true)}
                onMouseLeave={() => setOpenCart(false)}
              >
                <Badge badgeContent={cart?.length} color="error">
                  <ShoppingCartIcon style={{ color: 'white' }} />
                </Badge>
              </IconButton>
              {cart.length > 0 && openCart && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: 0, // Align to the right edge of the icon
                    top: '100%', // Position below the cart icon
                    width: 350,
                    backgroundColor: 'white',
                    boxShadow: 3,
                    borderRadius: 2,
                    p: 2,
                    zIndex: 1000, // Ensure it's above other elements
                    border: '1px solid #ddd',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={() => setOpenCart(true)}
                  onMouseLeave={() => setOpenCart(false)}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#999', mb: 1 }}>
                    Recently Added Products
                  </Typography>
                  <Divider />
                  <List>
                    {cart.slice(0, 5).map((item, index) => (
                      <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <Avatar src={item.imageUrl} sx={{ width: 50, height: 50, mr: 2 }} /> */}
                        <CardMedia
                          component="img"
                          sx={{
                            width: 50,
                            height: 50, // Adjust height to make it more visible
                            objectFit: 'contain', // Ensures full image is visible (adds whitespace if needed)
                          }}
                          image={item.imageUrl || 'https://via.placeholder.com/150'}
                          alt={item.name}
                        />
                        <ListItemText
                          primary={item.name}
                          secondary={`$${item.price} x ${item.qty}`}
                          primaryTypographyProps={{ sx: { fontSize: '0.9rem' } }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#e60000' }}>
                          ${(item.price * item.qty).toFixed(2)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>

                  {cart.length > 5 && (
                    <Typography variant="body2" sx={{ textAlign: 'center', color: '#777', mt: 1 }}>
                      {cart.length - 5} More Products In Cart
                    </Typography>
                  )}

                  <Button fullWidth variant="contained" color="error" sx={{ mt: 2, fontWeight: 'bold' }} onClick={handleCartClick}>
                    View My Shopping Cart
                  </Button>
                </Box>
              )}
            </Box>
            {props.isAuthenticated && <EntitiesMenu />}
            {props.isAuthenticated && props.isAdmin && <AdminMenu showOpenAPI={true} />}
            <LocaleMenu currentLocale={props.currentLocale} onClick={handleLocaleChange} />
            <AccountMenu isAuthenticated={props.isAuthenticated} />
          </Box>
        </Collapse>
      </Navbar>
      {/* {cart.length > 0 && (
        <Box sx={{ position: 'absolute', right: 20, top: 60, width: 300, backgroundColor: 'white', boxShadow: 3, borderRadius: 2, p: 2 }}>
          <Typography variant="h6">Recently Added Products</Typography>
          <Divider />
          <List>
            {cart.slice(0, 5)?.map((item, index) => (
              <ListItem key={index}>
                <Avatar src={item.imageUrl} sx={{ width: 50, height: 50, mr: 2 }} />
                <ListItemText primary={item.name} secondary={`$${item.price} x ${item.qty}`} />
              </ListItem>
            ))}
          </List>
          {cart.length > 5 && <Typography variant="body2">{cart.length - 5} More Products In Cart</Typography>}
          <Button fullWidth variant="contained" color="primary" onClick={handleCartClick}>
            View My Shopping Cart
          </Button>
        </Box>
      )} */}

      {/* <Navbar data-cy="navbar" dark expand="md" fixed="top" className="jh-navbar">
        <NavbarToggler aria-label="Menu" onClick={toggleMenu} />
        <Collapse isOpen={menuOpen} navbar>
          <Nav id="header-tabs" className="ms-auto" navbar>
            <Home />
            {props.isAuthenticated && <EntitiesMenu />}
            {props.isAuthenticated && props.isAdmin && <AdminMenu showOpenAPI={true} />}
            <LocaleMenu currentLocale={props.currentLocale} onClick={handleLocaleChange} />
            <AccountMenu isAuthenticated={props.isAuthenticated} />
          </Nav>
        </Collapse>
        <Brand />
      </Navbar> */}
    </div>
  );
};

export default Header;
