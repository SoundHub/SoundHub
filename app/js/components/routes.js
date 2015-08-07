'use strict';
import React from 'react';
import Router from 'react-router';

import Layout from './layout';
import Home from './home';
import NotFound from './notfound';
import Auth from './auth';
import MyMusic from './mymusic';
import Tree from './tree';
import Profile from './profile';
import Create from './create';



const Route = Router.Route;
const DefaultRoute = Router.DefaultRoute;
const NotFoundRoute = Router.NotFoundRoute;

const routes = (
  <Route handler={Layout}>
    <DefaultRoute name="home" handler={Home}/>
    <Route name="mymusic" handler={MyMusic}/>
    <Route name="tree" handler={Tree}/>
    <Route name="profile" handler={Profile}/>
    <Route name="create" handler={Create}/>
    <Route name="auth" handler={Auth}/>
    <NotFoundRoute name="not-found" handler={NotFound}/>
  </Route>
);

export default routes;
