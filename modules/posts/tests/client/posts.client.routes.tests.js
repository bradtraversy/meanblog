(function () {
  'use strict';

  describe('Posts Route Tests', function () {
    // Initialize global variables
    var $scope,
      PostsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PostsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PostsService = _PostsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('posts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/posts');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          PostsController,
          mockPost;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('posts.view');
          $templateCache.put('modules/posts/client/views/view-post.client.view.html', '');

          // create mock Post
          mockPost = new PostsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Post Name'
          });

          // Initialize Controller
          PostsController = $controller('PostsController as vm', {
            $scope: $scope,
            postResolve: mockPost
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:postId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.postResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            postId: 1
          })).toEqual('/posts/1');
        }));

        it('should attach an Post to the controller scope', function () {
          expect($scope.vm.post._id).toBe(mockPost._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/posts/client/views/view-post.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PostsController,
          mockPost;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('posts.create');
          $templateCache.put('modules/posts/client/views/form-post.client.view.html', '');

          // create mock Post
          mockPost = new PostsService();

          // Initialize Controller
          PostsController = $controller('PostsController as vm', {
            $scope: $scope,
            postResolve: mockPost
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.postResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/posts/create');
        }));

        it('should attach an Post to the controller scope', function () {
          expect($scope.vm.post._id).toBe(mockPost._id);
          expect($scope.vm.post._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/posts/client/views/form-post.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PostsController,
          mockPost;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('posts.edit');
          $templateCache.put('modules/posts/client/views/form-post.client.view.html', '');

          // create mock Post
          mockPost = new PostsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Post Name'
          });

          // Initialize Controller
          PostsController = $controller('PostsController as vm', {
            $scope: $scope,
            postResolve: mockPost
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:postId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.postResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            postId: 1
          })).toEqual('/posts/1/edit');
        }));

        it('should attach an Post to the controller scope', function () {
          expect($scope.vm.post._id).toBe(mockPost._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/posts/client/views/form-post.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
