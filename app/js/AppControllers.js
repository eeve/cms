import angular from 'angular';

angular.module('AppCtrls',[])

  //文章
  .controller('PostsCtrl',function($scope, $state, Post){

    $scope.posts = Post.all();

    var createPost = function(post){
      if(post){
        Post.save(post);
      }
    }

    $scope.save = function(post){
      createPost(post);
      $state.go('list');
    }

  });
