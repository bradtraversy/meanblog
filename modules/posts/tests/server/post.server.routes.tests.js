'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Post = mongoose.model('Post'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  post;

/**
 * Post routes tests
 */
describe('Post CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Post
    user.save(function () {
      post = {
        name: 'Post name'
      };

      done();
    });
  });

  it('should be able to save a Post if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Post
        agent.post('/api/posts')
          .send(post)
          .expect(200)
          .end(function (postSaveErr, postSaveRes) {
            // Handle Post save error
            if (postSaveErr) {
              return done(postSaveErr);
            }

            // Get a list of Posts
            agent.get('/api/posts')
              .end(function (postsGetErr, postsGetRes) {
                // Handle Posts save error
                if (postsGetErr) {
                  return done(postsGetErr);
                }

                // Get Posts list
                var posts = postsGetRes.body;

                // Set assertions
                (posts[0].user._id).should.equal(userId);
                (posts[0].name).should.match('Post name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Post if not logged in', function (done) {
    agent.post('/api/posts')
      .send(post)
      .expect(403)
      .end(function (postSaveErr, postSaveRes) {
        // Call the assertion callback
        done(postSaveErr);
      });
  });

  it('should not be able to save an Post if no name is provided', function (done) {
    // Invalidate name field
    post.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Post
        agent.post('/api/posts')
          .send(post)
          .expect(400)
          .end(function (postSaveErr, postSaveRes) {
            // Set message assertion
            (postSaveRes.body.message).should.match('Please fill Post name');

            // Handle Post save error
            done(postSaveErr);
          });
      });
  });

  it('should be able to update an Post if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Post
        agent.post('/api/posts')
          .send(post)
          .expect(200)
          .end(function (postSaveErr, postSaveRes) {
            // Handle Post save error
            if (postSaveErr) {
              return done(postSaveErr);
            }

            // Update Post name
            post.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Post
            agent.put('/api/posts/' + postSaveRes.body._id)
              .send(post)
              .expect(200)
              .end(function (postUpdateErr, postUpdateRes) {
                // Handle Post update error
                if (postUpdateErr) {
                  return done(postUpdateErr);
                }

                // Set assertions
                (postUpdateRes.body._id).should.equal(postSaveRes.body._id);
                (postUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Posts if not signed in', function (done) {
    // Create new Post model instance
    var postObj = new Post(post);

    // Save the post
    postObj.save(function () {
      // Request Posts
      request(app).get('/api/posts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Post if not signed in', function (done) {
    // Create new Post model instance
    var postObj = new Post(post);

    // Save the Post
    postObj.save(function () {
      request(app).get('/api/posts/' + postObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', post.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Post with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/posts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Post is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Post which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Post
    request(app).get('/api/posts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Post with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Post if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Post
        agent.post('/api/posts')
          .send(post)
          .expect(200)
          .end(function (postSaveErr, postSaveRes) {
            // Handle Post save error
            if (postSaveErr) {
              return done(postSaveErr);
            }

            // Delete an existing Post
            agent.delete('/api/posts/' + postSaveRes.body._id)
              .send(post)
              .expect(200)
              .end(function (postDeleteErr, postDeleteRes) {
                // Handle post error error
                if (postDeleteErr) {
                  return done(postDeleteErr);
                }

                // Set assertions
                (postDeleteRes.body._id).should.equal(postSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Post if not signed in', function (done) {
    // Set Post user
    post.user = user;

    // Create new Post model instance
    var postObj = new Post(post);

    // Save the Post
    postObj.save(function () {
      // Try deleting Post
      request(app).delete('/api/posts/' + postObj._id)
        .expect(403)
        .end(function (postDeleteErr, postDeleteRes) {
          // Set message assertion
          (postDeleteRes.body.message).should.match('User is not authorized');

          // Handle Post error error
          done(postDeleteErr);
        });

    });
  });

  it('should be able to get a single Post that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Post
          agent.post('/api/posts')
            .send(post)
            .expect(200)
            .end(function (postSaveErr, postSaveRes) {
              // Handle Post save error
              if (postSaveErr) {
                return done(postSaveErr);
              }

              // Set assertions on new Post
              (postSaveRes.body.name).should.equal(post.name);
              should.exist(postSaveRes.body.user);
              should.equal(postSaveRes.body.user._id, orphanId);

              // force the Post to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Post
                    agent.get('/api/posts/' + postSaveRes.body._id)
                      .expect(200)
                      .end(function (postInfoErr, postInfoRes) {
                        // Handle Post error
                        if (postInfoErr) {
                          return done(postInfoErr);
                        }

                        // Set assertions
                        (postInfoRes.body._id).should.equal(postSaveRes.body._id);
                        (postInfoRes.body.name).should.equal(post.name);
                        should.equal(postInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Post.remove().exec(done);
    });
  });
});
