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

        return (result && result.action && promise) || result || page;
      };
    };

    var toAutomator = function (filter) {
      return convertToAutomator(then(wrapFilter(filter)), page);
    };

    return {
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
  var automator = function (page) {
    var promise = $.Deferred().resolve(page).promise();

    return convertToAutomator(promise, page);
  };

  var testmator = automator;

  return _.extend(testmator, {
    PageObject: PageObject,
    automator: automator
  });
})();
