import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'app/config/dayjs';

import React, { useEffect } from 'react';
import { Card } from 'reactstrap';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
// import { getProfile } from 'app/shared/reducers/application-profile';
import Header from 'app/shared/layout/header/header';
import Footer from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';
import { CartProvider } from './context/cartContext';
import { SearchProvider } from './context/searchContext';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSession());
    // dispatch(getProfile());
  }, []);

  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  // const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
  // const isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
  // const isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);

  const paddingTop = '60px';
  return (
    <CartProvider>
      <SearchProvider>
        <BrowserRouter basename={baseHref}>
          <div className="app-container" style={{ minHeight: '100vh', paddingTop }}>
            <ToastContainer position="top-left" className="toastify-container" toastClassName="toastify-toast" />
            <ErrorBoundary>
              <Header
                isAuthenticated={isAuthenticated}
                isAdmin={isAdmin}
                currentLocale={currentLocale}
                // ribbonEnv={ribbonEnv}
                // isInProduction={isInProduction}
                // isOpenAPIEnabled={isOpenAPIEnabled}
              />
            </ErrorBoundary>
            <div className="container-fluid view-container" id="app-view-container">
              <Card style={{ height: '100%' }}>
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              </Card>
              {/* <Footer /> */}
            </div>
          </div>
        </BrowserRouter>
      </SearchProvider>
    </CartProvider>
  );
};

export default App;
