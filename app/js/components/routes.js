'use strict';
import React from 'react';
import Router from 'react-router';

import Layout from './layout';
import Home from './home';
import NotFound from './notfound';
import User from './userdomain';
import About from './about';

import Tree from './treePage';
import Create from './create';

const Route = Router.Route;
const DefaultRoute = Router.DefaultRoute;
const NotFoundRoute = Router.NotFoundRoute;

const routes = (
  <Route handler={Layout}>
    <DefaultRoute name="home" handler={Home}/>
    <Route name="user" path="/user" handler={User}/>
    <Route name="about" path="/about" handler={About}/>
    <Route name="tree" path="/tree/:rootId&:uuid"  handler={Tree}/>
    <NotFoundRoute name="not-found" handler={NotFound}/>
  </Route>
);

export default routes;
