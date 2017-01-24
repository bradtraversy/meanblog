// Posts service used to communicate Posts REST endpoints
(function () {
  'use strict';

  angular
    .module('posts')
    .factory('PostsService', PostsService);

  PostsService.$inject = ['$resource'];

  function PostsService($resource) {
    return $resource('api/posts/:postId', {
      postId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
