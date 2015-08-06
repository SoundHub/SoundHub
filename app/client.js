'use strict';
import React from 'react';
import Router from 'react-router';
import Routes from './components/routes';

Router.run(Routes, Router.HistoryLocation, function(Root) {
  React.render(<Root />, document.body);
});

