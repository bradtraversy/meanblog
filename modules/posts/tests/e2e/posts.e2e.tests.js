'use strict';

describe('Posts E2E Tests:', function () {
  describe('Test Posts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/posts');
      expect(element.all(by.repeater('post in posts')).count()).toEqual(0);
    });
  });
});
