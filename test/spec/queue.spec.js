(function () {
  'use strict';

  var createQueue = testmator.createQueue;

  describe('Queue', function () {
    var action;
    var queue;

    beforeEach(function () {
      action = jasmine.createSpy('action');
      queue = createQueue();
    });

    it('Run 3 times', function (done) {
      queue.push(action);
      queue.push(action);
      queue.push(action);

      queue.fire()
        .then(function () {
          expect(action.calls.count()).toEqual(3);
        })
        .done(done);
    });

    it('Run one time', function (done) {
      queue.push(action);

      queue.fire()
        .then(function () {
          expect(action.calls.count()).toEqual(1);
        })
        .done(done);
    });

    it('No action after fire', function (done) {
      var count;

      $.Deferred().resolve().promise()
        .then(function () {
          queue.push(action);
          return queue.fire();
        })
        .then(function () {
          count = action.calls.count();
        })
        .then(function () {
          // Once more.
          return queue.fire();
        })
        .then(function () {
          expect(action.calls.count()).toEqual(count);
        })
        .done(done);
    });

    it('Fire and fire', function (done) {
      var count;

      $.Deferred().resolve().promise()
        .then(function () {
          queue.push(action);
          queue.push(action);
          return queue.fire();
        })
        .then(function () {
          count = action.calls.count();
        })
        .then(function () {
          queue.push(action);
          return queue.fire();
        })
        .then(function () {
          expect(action.calls.count()).toEqual(count + 1);
        })
        .done(done);
    });
  });
})();
