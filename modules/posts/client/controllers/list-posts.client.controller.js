(function () {
  'use strict';

  angular
    .module('posts')
    .controller('PostsListController', PostsListController);

  PostsListController.$inject = ['PostsService'];

  function PostsListController(PostsService) {
    var vm = this;

    vm.posts = PostsService.query();
  }
}());
