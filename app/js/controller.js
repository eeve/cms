import angular from 'angular';

angular.module('app.controllers',[])

  //文章
  .controller('PostsController',['$scope', '$state', 'Post', function($scope, $state, Post){

    $scope.posts = Post.all();

    $scope.save = function(post){
      if(!post) return;
      Post.save(post);
      $state.go('posts.list');
    };

    $scope.delete = function(index){
      if(!confirm('确定删除?')){
        return;
      }
      $scope.posts.splice(index,1);
      Post.saveAll($scope.posts);
    };

  }])

  .controller('PostDetailCtrl', ['$scope', 'Post', function($scope, Post){
    var index = $scope.$stateParams.post_id;
    if(index){
      $scope.post = Post.all()[index];
    }
  }])

;
