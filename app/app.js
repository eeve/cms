import 'bootstrap/dist/css/bootstrap.css';

import angular from 'angular';
import 'angular-ui-router';

import './js/AppControllers';
import './js/AppServices';

var App = angular.module('App',[
  'ui.router',
  'AppCtrls',
  'AppServices'
]);

App.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
    .state('write', {
      url:'/write',
      templateUrl: 'write.html'
    })
    .state('list', {
      url:'/list',
      templateUrl: 'list.html'
    });

  $urlRouterProvider.otherwise('/list');

});
