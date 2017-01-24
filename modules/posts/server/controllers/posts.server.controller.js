'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Post
 */
exports.create = function(req, res) {
  var post = new Post(req.body);
  post.user = req.user;

  post.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(post);
    }
  });
};

/**
 * Show the current Post
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var post = req.post ? req.post.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  post.isCurrentUserOwner = req.user && post.user && post.user._id.toString() === req.user._id.toString();

  res.jsonp(post);
};

/**
 * Update a Post
 */
exports.update = function(req, res) {
  var post = req.post;

  post = _.extend(post, req.body);

  post.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(post);
    }
  });
};

/**
 * Delete an Post
 */
exports.delete = function(req, res) {
  var post = req.post;

  post.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(post);
    }
  });
};

/**
 * List of Posts
 */
exports.list = function(req, res) {
  Post.find().sort('-created').populate('user', 'displayName').exec(function(err, posts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(posts);
    }
  });
};

/**
 * Post middleware
 */
exports.postByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Post is invalid'
    });
  }

  Post.findById(id).populate('user', 'displayName').exec(function (err, post) {
    if (err) {
      return next(err);
    } else if (!post) {
      return res.status(404).send({
        message: 'No Post with that identifier has been found'
      });
    }
    req.post = post;
    next();
  });
};
