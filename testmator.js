// hogehoge
window.testmator = (function () {
  'use strict';

  var setTransitionType = (function () {
    var transitionType = 'normal';

    var originalEmulateTransitionEnd = $.fn.emulateTransitionEnd;
    $.fn.emulateTransitionEnd = function () {
      var args = _.toArray(arguments);

      if (transitionType === 'immediately') {
        // Fire immediately.
        $(this).trigger($.support.transition.end);
        return this;

      } else if (transitionType === 'fast' && args.length > 0) {
        // Fire fast.
        args[0] = 1;
      }

      return originalEmulateTransitionEnd.apply(this, args);
    };

    return function (type) {
      transitionType = type;
    };
  })();

  var createQueue = function () {
    var actions = [];

    return {
      push: function (action) {
        actions.push(action);
      },
      fire: function () {
        var deferred = $.Deferred();
        var fireActions = _.clone(actions);
        actions = [];

        setTimeout(function () {
          fireActions.forEach(function (action) {
            action();
          });
          deferred.resolve();
        }, 11);

        return deferred.promise();
      }
    };
  };

  var getRoot = function ($element) {
    while (true) {
      var $parent = $element.parent();
      if ($parent.length <= 0) {
        return $element;
      }
      $element = $parent;
    }
  };

  var createTransitionObjectEventOnly = function ($element, start, end) {
    var events = [
      {start: 'show.bs.modal', end: 'shown.bs.modal'},
      {start: 'hide.bs.modal', end: 'hidden.bs.modal'},
      {start: 'show.bs.collapse', end: 'shown.bs.collapse'},
      {start: 'hide.bs.collapse', end: 'hidden.bs.collapse'},
      {start: 'show.bs.dropdown', end: 'shown.bs.dropdown'},
      {start: 'hide.bs.dropdown', end: 'hidden.bs.dropdown'},
      {start: 'hide.bs.alert', end: 'hidden.bs.alert'}
    ];

    events.forEach(function (eventInfo) {
      $element.on(eventInfo.start, function (e) {
        if (start) {
          start.apply(this, arguments);
        }

        $(e.target).one(eventInfo.end, function () {
          if (end) {
            end.apply(this, arguments);
          }
        });
      });
    });

    return {};
  };

  var createTransitionObject = function ($element, start, end) {
    var transitioning = 0;
    var actions = [];

    var s = function () {
      transitioning++;
      if (start) {
        start.apply(this, arguments);
      }
    };
    var e = function () {
      if (transitioning > 0) {
        transitioning--;

        if (transitioning === 0) {
          actions.forEach(function (action) {
            action();
          });
        }
      }

      if (end) {
        end.apply(this, arguments);
      }
    };

    return _.extend(createTransitionObjectEventOnly($element, s, e), {
      transitioning: function () {
        return transitioning > 0;
      },
      onTransitionEnd: function (action) {
        actions.push(action);
      }
    });
  };

  $.fn.transitionPromise = function () {
    var args = _.toArray(arguments);
    var deferred = $.Deferred();

    var $root = getRoot($(this));
    var queue = $root.data('transition.queue');
    if (!queue) {
      queue = createQueue();
      $root.data('transition.queue', queue);

      var transition = createTransitionObject($(this));
      transition.onTransitionEnd(_.bind(queue.fire, queue));
      $root.data('transition.object', transition);
    }

    queue.push(function () {
      deferred.resolve.apply(deferred, args);
    });

    if (!$root.data('transition.object').transitioning()) {
      queue.fire();
    }

    return deferred.promise();
  };

  // Backbone like extend function.
  var extend = function (protoProps, staticProps) {
    var parent = this;
    var child = function () {
      return parent.apply(this, arguments);
    };

    // Inherit static properties.
    _.extend(child, parent, staticProps);

    var Surrogate = function () {
      this.constructor = child;
    };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Inherit prototype properties.
    if (protoProps) {
      _.extend(child.prototype, protoProps);
    }

    return child;
  };

  var PageObject = function (options) {
    var el = (options && options.el) || options;
    if (_.isFunction(el)) {
      el = el();
    }
    // '#hoge' -> $('#hoge')
    if (_.isString(el)) {
      el = $(el);
    }
    // view = new Backbone.View({el: '#hoge'});
    // el = view.el
    if (el && el.el) {
      el = el.el;
    }

    this.$el = (el instanceof $) ? el : $(el);
    this.el = this.$el[0];

    this.parent = options && options.parent;
  };

  _.extend(PageObject, {
    extend: extend
  });

  _.extend(PageObject.prototype, {
    $: function () {
      return this.$el.find.apply(this.$el, arguments);
    },
    click: function () {
      this.$.apply(this, arguments).trigger('click');
    },
    switchParent: function () {
      return this.parent;
    }
  });

  // Convert from Promise to Automator object.
  var convertToAutomator = function (promise, page) {
    var then = function (filter) {
      return promise.then(filter);
    };

    var wrapFilter = function (filter) {
      return function (target) {
        var result = filter(target);

        return (result && result.getPromise && result.getPromise()) || result || target || page;
      };
    };

    var toAutomator = function (filter) {
      return convertToAutomator(then(wrapFilter(filter)), page);
    };

    return {
      getPromise: function () {
        return promise;
      },
      getPage: function () {
        return page;
      },
      action: function (filter) {
        return toAutomator(filter);
      },
      scope: function (filter) {
        return toAutomator(filter);
      },
      test: function (filter) {
        return toAutomator(filter);
      },
      done: _.bind(promise.done, promise)
    };
  };

  // Convert Automator object.
  var makeAutomator = function (page) {
    var promise = $.Deferred().resolve(page).promise();

    return convertToAutomator(promise, page);
  };

  var wrapAutomator = function (automator, builder) {
    var bind = function (name) {
      return function () {
        var result = automator[name].apply(automator, arguments);

        return (result && result.getPromise) ? builder(result) : result;
      };
    };

    return _.chain(automator)
      .functions()
      .map(function (name) {
        return [
          name,
          bind(name)
        ];
      })
      .object()
      .value();
  };

  // Use named action.
  // ex: .action('clickAt', 0)
  var namedAutomator = makeAutomator.namedAutomator = function (automator) {
    var wrapper = wrapAutomator(automator, namedAutomator);

    var originalAction = wrapper.action;
    wrapper.action = function () {
      var args = _.toArray(arguments);

      // Replace method name to function.
      if (_.isString(_.first(args))) {
        var copyArgs = _.clone(args);
        var name = copyArgs.shift();
        args = [
          function (page) {
            return page[name].apply(page, copyArgs);
          }
        ];
      }

      return originalAction.apply(this, args);
    };

    return wrapper;
  };

  // Use direct method.
  // ex: .clickAt(0)
  var functionAutomator = makeAutomator.functionAutomator = function (automator) {
    var wrapper = wrapAutomator(automator, functionAutomator);

    var page = wrapper.getPage();
    var proxy = function (name) {
      return function () {
        var args = _.toArray(arguments);
        return wrapper.action(function () {
          return page[name].apply(page, args);
        });
      };
    };

    var proxies = _.chain(page)
          .functions()
          .map(function (name) {
            return [
              name,
              proxy(name)
            ];
          })
          .object()
          .value();

    return _.extend(proxies, wrapper);
  };

  // Wait Bootstrap animation.
  var waitAutomator = makeAutomator.waitAutomator = function (automator) {
    // initialize wait transition object.
    automator.getPage().$el.transitionPromise();

    var wrapper = wrapAutomator(automator, waitAutomator);

    var proxy = function (name) {
      var original = wrapper[name];

      return function (filter) {
        return original.call(this, function (target) {
          var result = filter.call(target, target);

          // Return transition promise if result is PageObject.
          if (result.$el) {
            return result.$el.transitionPromise(result);
          }

          if (result.getPromise) {
            return result.getPromise()
              .then(function (target) {
                return target.$el.transitionPromise(target);
              });
          }

          return result;
        });
      };
    };

    wrapper.action = proxy('action');
    wrapper.scope = proxy('scope');

    return wrapper;
  };

  var testmator = function (page) {
    return functionAutomator(namedAutomator(waitAutomator(makeAutomator(page))));
  };

  return _.extend(testmator, {
    PageObject: PageObject,
    automator: makeAutomator,
    getRoot: getRoot,
    createQueue: createQueue,
    createTransitionObject: createTransitionObject,
    setTransitionType: setTransitionType
  });
})();
