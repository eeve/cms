import angular from 'angular';

angular.module('app.filters',[])

  .filter('to_trust',function($sce){
    return function(html){
      return $sce.trustAsHtml(html);
    }
  })
;

