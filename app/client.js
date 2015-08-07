'use strict';
import React from 'react';
import Router from 'react-router';
import Routes from './js/components/routes';

Router.run(Routes, Router.HistoryLocation, function(Root) {
  React.render(<Root />, document.body);
});

