import 'bootstrap/dist/css/bootstrap.css';

import angular from 'angular';
import 'angular-ui-router';

import './js/controller';
import './js/service';
import './js/filter';

angular.module('app.dashboard',[
  'ui.router',
  'app.controllers',
  'app.services',
  'app.filters'
])

  .run(function($rootScope, $state, $stateParams){
    // 方便获得当前状态的方法，绑到根作用域
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  })

  .config(function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state('posts', {
        url:'/posts',
        templateUrl: 'posts.html'
      })
      .state('posts.write', {
        url:'/write',
        templateUrl: 'write.html'
      })
      .state('posts.list', {
        url:'/list',
        templateUrl: 'list.html'
      })
      .state('posts.detail', {
        url:'/detail/:post_id',
        templateUrl: 'detail.html'
      });

    $urlRouterProvider.otherwise('/posts/list');
  })
;
