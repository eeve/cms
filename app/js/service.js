import angular from 'angular';

angular.module('app.services',[])

  .factory('Store', function(){
    return {
      save:function(key,posts){
        window.localStorage.setItem(key,posts);
      },
      get:function(key){
        return window.localStorage.getItem(key);
      }
    };
  })

  .factory('Post', ['Store', function(Store){
    return {
      all: function(){
        return angular.fromJson(Store.get('posts') || []);
      },
      save: function(post){
        if(post){
          post.desc = (post.content && post.content.length>5) ? post.content.split('').splice(0,255).join('') : post.content;
          post.image = './img/icon.png';
          Store.save('posts',angular.toJson((this.all()||[]).concat([post])));
        }
      },
      saveAll: function(posts){
        Store.save('posts',angular.toJson(posts));
      }
    }
  }])

