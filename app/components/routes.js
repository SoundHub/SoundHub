'use strict';
import React from 'react';
import Router from 'react-router';

import Layout from './layout';
import Home from './home';
import NotFound from './notfound';
import Auth from './auth';
import Songs from './songs';
import Song from './song';
import Profile from './profile';
import Create from './create';



const Route = Router.Route;
const DefaultRoute = Router.DefaultRoute;
const NotFoundRoute = Router.NotFoundRoute;

const routes = (
  <Route handler={Layout}>
    <DefaultRoute name="home" handler={Home}/>
    <Route name="songs" handler={Songs}/>
    <Route name="song" handler={Song}/>
    <Route name="profile" handler={Profile}/>
    <Route name="create" handler={Create}/>
    <Route name="auth" handler={Auth}/>
    <NotFoundRoute name="not-found" handler={NotFound}/>
  </Route>
);

export default routes;
