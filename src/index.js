import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './style/style.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import {store} from './store/redux';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import LoginPage from './containers/LoginPage/LoginPage';
import Signout from './components/auth/signout';
import SignupForm from './components/auth/SignupForm/SignupForm';
import ProtectedPage from './components/protected';
import EditorContainer from './containers/EditorContainer';
import RequireAuth from './components/auth/require_auth';
import RequireEditor from './components/auth/require_editor';
import BlogPage from './containers/BlogPage';
import SignupProvider from './containers/SignupProvider/SignupProvider';
import SignupPatient from './containers/SignupPatient/SignupPatient';
import Account from './containers/Account/Account';
import CustomersPage from "./containers/CustomersPage/CustomersPage";
import BranchManagement from './containers/BranchManagement/BranchManagement';
import PasswordResetForm from './containers/PasswordResetForm/PasswordResetForm';
import AccessRecovery from './containers/AccessRecovery/AccessRecovery';
import LandingPage from  './containers/LandingPage/LandingPage';


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
          <Switch>
            <Route exact path="/myaccount" component={RequireAuth(Account)} />
            <Route exact path="/myaccount/customers" component={RequireAuth(CustomersPage)} />
            <Route exact path="/myaccount/branches" component={RequireAuth(BranchManagement)} />
            <Route exact path="/myaccount/:section/date/:date/:month/:year/" component={RequireAuth(Account)} />
            <Route exact path="/myaccount/:section/date/:date/:month/:year/:hourly" component={RequireAuth(Account)} />
            <Route path="/about" component={App} />
            <Route path="/signin" component={LoginPage} />
            <Route path="/signout" component={Signout} />
            <Route path="/blog/:title" component={BlogPage} />
            <Route exact path="/signup" component={SignupForm} />
            <Route path="/signup/clinic" component={SignupProvider} />
            <Route path="/signup/patient" component={SignupPatient} />
            <Route path="/passwordreset/:recoveryId/:email" component={PasswordResetForm} />
            <Route path="/accessrecovery" component={AccessRecovery} />
            <Route path="/protected" component={RequireAuth(ProtectedPage)} />
            <Route path="/editor" component={RequireEditor(EditorContainer)} />
            <Route exact path="/" component={LandingPage} />
            <Route path="*" render={() => (<Redirect to="/" />)} />
            <Route component={LandingPage} />
          </Switch>
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
