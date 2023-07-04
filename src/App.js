import React, { useState, Suspense, useEffect } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { ErrorPage } from './views/404';
import Home from './views/Home';
import { LoginPage } from './views/LoginPage/LoginPage';
import { ForgotPassword } from './views/ForgotPassword/ForgotPassword';
import SignUp from './views/SignUpPage';
import { DashboardPage } from './views/Home/DashboardPage/DashboardPage';
import { Protected } from './components/Protected';
import { SpacesPage } from './views/Home/SpacesPage/SpacesPage';
import { NewPasswordPage } from './views/NewPasswordPage/NewPasswordPage';
import { TokenExpiredPage } from './views/TokenExpiredPage/ForgotPassword';
import { UsersPage } from './views/Home/UsersPage/UsersPage';
import { CollaboratorsPage } from './views/Home/CollaboratorsPage/CollaboratorsPage';
import { SpacePage } from './views/Home/SpacePage/SpacePage';
import { CustomLoader } from './components/CustomLoader/CustomLoader';
import { useSelector, useDispatch } from 'react-redux';
import history from './history';
import { CustomModal } from './components/CustomModal/CustomModal';
import { hideSimpleModalAction, setMe } from './redux/actions';
import { fetchMe } from './crud/auth';
import './index.scss';

const App = () => {
  const dispatch = useDispatch();
  const loader = useSelector(state => state.helpers.loader);
  const simpleModal = useSelector(state => state.helpers.simpleModal);

  useEffect(() => {
    fetchMe()
      .then(res => {
        dispatch(setMe(res.data));
        if (window.location.pathname === '/login') {
          history.push('/home/spaces?page=1')
        }
      })
  }, []);

  const handleClose = () => {
    dispatch(hideSimpleModalAction());
  };

  return (
    <Suspense fallback={<CustomLoader />}>

      {loader && <CustomLoader />}

      {simpleModal.isModal && (
        <div className='error-modal'>
          <CustomModal
            title={simpleModal.title}
            close={handleClose}
            isCancelBtn={false}
            submitBtn="OK"
            submit={handleClose}
          >
            <div className='error-modal__text'>{simpleModal.text}</div>
          </CustomModal>
        </div>
      )}

      <Router history={history}>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/home/spaces?page=1" />
          </Route>

          <Route path="/login">
            <LoginPage />
          </Route>

          <Route path="/forgot-password">
            <ForgotPassword />
          </Route>

          <Route path="/sign-up">
            <SignUp />
          </Route>

          <Route path="/auth/recovery/*">
            <NewPasswordPage />
          </Route>

          <Route path="/auth/invite/*">
            <NewPasswordPage />
          </Route>

          <Route path="/auth/verify/*">
            <NewPasswordPage />
          </Route>

          <Route path="/auth/token-expired">
            <TokenExpiredPage />
          </Route>

          <Route path="/home/spaces*">
            <Home>
              {props => <SpacesPage {...props} />}
            </Home>
          </Route>

          <Route path="/home/users*">
            <Protected roles={['admin']} redirect={'/home/spaces?page=1'}>
              <Home>
                {props => <UsersPage {...props} />}
              </Home>
            </Protected>
          </Route>

          <Route path="/home/collaborators*">
            <Protected roles={['admin', 'user']} redirect={'/home/spaces?page=1'}>
              <Home>
                {props => <CollaboratorsPage {...props} />}
              </Home>
            </Protected>
          </Route>

          <Route path="/home/space/:id">
            <Home>
              {props => <SpacePage {...props} />}
            </Home>
          </Route>

          <Route path="*">
            <ErrorPage />
          </Route>
        </Switch>
      </Router>
    </Suspense>
  );
}

export default App;
