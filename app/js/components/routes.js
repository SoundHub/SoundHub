'use strict';
import React from 'react';
import Router from 'react-router';

import Layout from './layout';
import Home from './home';
import NotFound from './notfound';
import Auth from './auth';
import User from './userdomain';
import Tree from './treePage';
import Create from './create';



const Route = Router.Route;
const DefaultRoute = Router.DefaultRoute;
const NotFoundRoute = Router.NotFoundRoute;

const routes = (
  <Route handler={Layout}>
    <DefaultRoute name="home" handler={Home}/>
    <Route name="user" path="/user" handler={User}/>
    <Route name="auth" path="/auth" handler={Auth}/>
    <Route name="tree" path="/tree/:id"  handler={Tree}/>
    <NotFoundRoute name="not-found" handler={NotFound}/>
  </Route>
);

export default routes;
