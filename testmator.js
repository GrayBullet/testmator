window.testmator = (function () {
  'use strict';

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

  return _.extend(makeAutomator, {
    PageObject: PageObject,
    automator: makeAutomator
  });
})();
