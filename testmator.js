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
      _.extend(child, protoProps);
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
  };

  _.extend(PageObject, {
    extend: extend
  });

  return _.extend({}, {
    PageObject: PageObject
  });
})();
