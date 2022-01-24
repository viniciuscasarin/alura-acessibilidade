!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t()
    : "function" == typeof define && define.amd
    ? define("inert", t)
    : t();
})(0, function () {
  "use strict";
  var e = (function () {
    function i(e, t) {
      for (var n = 0; n < t.length; n++) {
        var i = t[n];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(e, i.key, i);
      }
    }
    return function (e, t, n) {
      return t && i(e.prototype, t), n && i(e, n), e;
    };
  })();
  function i(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  var o = Array.prototype.slice,
    r = Element.prototype.matches || Element.prototype.msMatchesSelector,
    s = [
      "a[href]",
      "area[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])",
      "iframe",
      "object",
      "embed",
      "[contenteditable]",
      "video",
    ].join(","),
    a = (function () {
      function n(e, t) {
        i(this, n),
          (this._inertManager = t),
          (this._rootElement = e),
          (this._managedNodes = new Set()),
          this._rootElement.hasAttribute("aria-hidden")
            ? (this._savedAriaHidden =
                this._rootElement.getAttribute("aria-hidden"))
            : (this._savedAriaHidden = null),
          this._rootElement.setAttribute("aria-hidden", "true"),
          this._makeSubtreeUnfocusable(this._rootElement),
          (this._observer = new MutationObserver(this._onMutation.bind(this))),
          this._observer.observe(this._rootElement, {
            attributes: !0,
            childList: !0,
            subtree: !0,
          });
      }
      return (
        e(n, [
          {
            key: "destructor",
            value: function () {
              this._observer.disconnect(),
                this._rootElement &&
                  (null !== this._savedAriaHidden
                    ? this._rootElement.setAttribute(
                        "aria-hidden",
                        this._savedAriaHidden
                      )
                    : this._rootElement.removeAttribute("aria-hidden")),
                this._managedNodes.forEach(function (e) {
                  this._unmanageNode(e.node);
                }, this),
                (this._observer = null),
                (this._rootElement = null),
                (this._managedNodes = null),
                (this._inertManager = null);
            },
          },
          {
            key: "_makeSubtreeUnfocusable",
            value: function (e) {
              var t = this;
              l(e, function (e) {
                return t._visitNode(e);
              });
              var n = document.activeElement;
              if (!document.body.contains(e)) {
                for (var i = e, o = void 0; i; ) {
                  if (i.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                    o = i;
                    break;
                  }
                  i = i.parentNode;
                }
                o && (n = o.activeElement);
              }
              e.contains(n) &&
                (n.blur(),
                n === document.activeElement && document.body.focus());
            },
          },
          {
            key: "_visitNode",
            value: function (e) {
              if (e.nodeType === Node.ELEMENT_NODE) {
                var t = e;
                t !== this._rootElement &&
                  t.hasAttribute("inert") &&
                  this._adoptInertRoot(t),
                  (r.call(t, s) || t.hasAttribute("tabindex")) &&
                    this._manageNode(t);
              }
            },
          },
          {
            key: "_manageNode",
            value: function (e) {
              var t = this._inertManager.register(e, this);
              this._managedNodes.add(t);
            },
          },
          {
            key: "_unmanageNode",
            value: function (e) {
              var t = this._inertManager.deregister(e, this);
              t && this._managedNodes.delete(t);
            },
          },
          {
            key: "_unmanageSubtree",
            value: function (e) {
              var t = this;
              l(e, function (e) {
                return t._unmanageNode(e);
              });
            },
          },
          {
            key: "_adoptInertRoot",
            value: function (e) {
              var t = this._inertManager.getInertRoot(e);
              t ||
                (this._inertManager.setInert(e, !0),
                (t = this._inertManager.getInertRoot(e))),
                t.managedNodes.forEach(function (e) {
                  this._manageNode(e.node);
                }, this);
            },
          },
          {
            key: "_onMutation",
            value: function (e, t) {
              e.forEach(function (e) {
                var t = e.target;
                if ("childList" === e.type)
                  o.call(e.addedNodes).forEach(function (e) {
                    this._makeSubtreeUnfocusable(e);
                  }, this),
                    o.call(e.removedNodes).forEach(function (e) {
                      this._unmanageSubtree(e);
                    }, this);
                else if ("attributes" === e.type)
                  if ("tabindex" === e.attributeName) this._manageNode(t);
                  else if (
                    t !== this._rootElement &&
                    "inert" === e.attributeName &&
                    t.hasAttribute("inert")
                  ) {
                    this._adoptInertRoot(t);
                    var n = this._inertManager.getInertRoot(t);
                    this._managedNodes.forEach(function (e) {
                      t.contains(e.node) && n._manageNode(e.node);
                    });
                  }
              }, this);
            },
          },
          {
            key: "managedNodes",
            get: function () {
              return new Set(this._managedNodes);
            },
          },
          {
            key: "hasSavedAriaHidden",
            get: function () {
              return null !== this._savedAriaHidden;
            },
          },
          {
            key: "savedAriaHidden",
            set: function (e) {
              this._savedAriaHidden = e;
            },
            get: function () {
              return this._savedAriaHidden;
            },
          },
        ]),
        n
      );
    })(),
    d = (function () {
      function n(e, t) {
        i(this, n),
          (this._node = e),
          (this._overrodeFocusMethod = !1),
          (this._inertRoots = new Set([t])),
          (this._savedTabIndex = null),
          (this._destroyed = !1),
          this.ensureUntabbable();
      }
      return (
        e(n, [
          {
            key: "destructor",
            value: function () {
              if (
                (this._throwIfDestroyed(),
                this._node && this._node.nodeType === Node.ELEMENT_NODE)
              ) {
                var e = this._node;
                null !== this._savedTabIndex
                  ? e.setAttribute("tabindex", this._savedTabIndex)
                  : e.removeAttribute("tabindex"),
                  this._overrodeFocusMethod && delete e.focus;
              }
              (this._node = null),
                (this._inertRoots = null),
                (this._destroyed = !0);
            },
          },
          {
            key: "_throwIfDestroyed",
            value: function () {
              if (this.destroyed)
                throw new Error("Trying to access destroyed InertNode");
            },
          },
          {
            key: "ensureUntabbable",
            value: function () {
              if (this.node.nodeType === Node.ELEMENT_NODE) {
                var e = this.node;
                if (r.call(e, s)) {
                  if (-1 === e.tabIndex && this.hasSavedTabIndex) return;
                  e.hasAttribute("tabindex") &&
                    (this._savedTabIndex = e.tabIndex),
                    e.setAttribute("tabindex", "-1"),
                    e.nodeType === Node.ELEMENT_NODE &&
                      ((e.focus = function () {}),
                      (this._overrodeFocusMethod = !0));
                } else
                  e.hasAttribute("tabindex") &&
                    ((this._savedTabIndex = e.tabIndex),
                    e.removeAttribute("tabindex"));
              }
            },
          },
          {
            key: "addInertRoot",
            value: function (e) {
              this._throwIfDestroyed(), this._inertRoots.add(e);
            },
          },
          {
            key: "removeInertRoot",
            value: function (e) {
              this._throwIfDestroyed(),
                this._inertRoots.delete(e),
                0 === this._inertRoots.size && this.destructor();
            },
          },
          {
            key: "destroyed",
            get: function () {
              return this._destroyed;
            },
          },
          {
            key: "hasSavedTabIndex",
            get: function () {
              return null !== this._savedTabIndex;
            },
          },
          {
            key: "node",
            get: function () {
              return this._throwIfDestroyed(), this._node;
            },
          },
          {
            key: "savedTabIndex",
            set: function (e) {
              this._throwIfDestroyed(), (this._savedTabIndex = e);
            },
            get: function () {
              return this._throwIfDestroyed(), this._savedTabIndex;
            },
          },
        ]),
        n
      );
    })();
  function l(e, t, n) {
    if (e.nodeType == Node.ELEMENT_NODE) {
      var i = e;
      t && t(i);
      var o = i.shadowRoot;
      if (o) return void l(o, t, o);
      if ("content" == i.localName) {
        for (
          var r = i,
            s = r.getDistributedNodes ? r.getDistributedNodes() : [],
            a = 0;
          a < s.length;
          a++
        )
          l(s[a], t, n);
        return;
      }
      if ("slot" == i.localName) {
        for (
          var d = i,
            u = d.assignedNodes ? d.assignedNodes({ flatten: !0 }) : [],
            h = 0;
          h < u.length;
          h++
        )
          l(u[h], t, n);
        return;
      }
    }
    for (var c = e.firstChild; null != c; ) l(c, t, n), (c = c.nextSibling);
  }
  function u(e) {
    if (!e.querySelector("style#inert-style")) {
      var t = document.createElement("style");
      t.setAttribute("id", "inert-style"),
        (t.textContent =
          "\n[inert] {\n  pointer-events: none;\n  cursor: default;\n}\n\n[inert], [inert] * {\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n}\n"),
        e.appendChild(t);
    }
  }
  var t = new ((function () {
    function t(e) {
      if ((i(this, t), !e))
        throw new Error(
          "Missing required argument; InertManager needs to wrap a document."
        );
      (this._document = e),
        (this._managedNodes = new Map()),
        (this._inertRoots = new Map()),
        (this._observer = new MutationObserver(this._watchForInert.bind(this))),
        u(e.head || e.body || e.documentElement),
        "loading" === e.readyState
          ? e.addEventListener(
              "DOMContentLoaded",
              this._onDocumentLoaded.bind(this)
            )
          : this._onDocumentLoaded();
    }
    return (
      e(t, [
        {
          key: "setInert",
          value: function (e, t) {
            if (t) {
              if (this._inertRoots.has(e)) return;
              var n = new a(e, this);
              if (
                (e.setAttribute("inert", ""),
                this._inertRoots.set(e, n),
                !this._document.body.contains(e))
              )
                for (var i = e.parentNode; i; )
                  11 === i.nodeType && u(i), (i = i.parentNode);
            } else {
              if (!this._inertRoots.has(e)) return;
              this._inertRoots.get(e).destructor(),
                this._inertRoots.delete(e),
                e.removeAttribute("inert");
            }
          },
        },
        {
          key: "getInertRoot",
          value: function (e) {
            return this._inertRoots.get(e);
          },
        },
        {
          key: "register",
          value: function (e, t) {
            var n = this._managedNodes.get(e);
            return (
              void 0 !== n ? n.addInertRoot(t) : (n = new d(e, t)),
              this._managedNodes.set(e, n),
              n
            );
          },
        },
        {
          key: "deregister",
          value: function (e, t) {
            var n = this._managedNodes.get(e);
            return n
              ? (n.removeInertRoot(t),
                n.destroyed && this._managedNodes.delete(e),
                n)
              : null;
          },
        },
        {
          key: "_onDocumentLoaded",
          value: function () {
            o
              .call(this._document.querySelectorAll("[inert]"))
              .forEach(function (e) {
                this.setInert(e, !0);
              }, this),
              this._observer.observe(this._document.body, {
                attributes: !0,
                subtree: !0,
                childList: !0,
              });
          },
        },
        {
          key: "_watchForInert",
          value: function (e, t) {
            var i = this;
            e.forEach(function (e) {
              switch (e.type) {
                case "childList":
                  o.call(e.addedNodes).forEach(function (e) {
                    if (e.nodeType === Node.ELEMENT_NODE) {
                      var t = o.call(e.querySelectorAll("[inert]"));
                      r.call(e, "[inert]") && t.unshift(e),
                        t.forEach(function (e) {
                          this.setInert(e, !0);
                        }, i);
                    }
                  }, i);
                  break;
                case "attributes":
                  if ("inert" !== e.attributeName) return;
                  var t = e.target,
                    n = t.hasAttribute("inert");
                  i.setInert(t, n);
              }
            }, this);
          },
        },
      ]),
      t
    );
  })())(document);
  Element.prototype.hasOwnProperty("inert") ||
    Object.defineProperty(Element.prototype, "inert", {
      enumerable: !0,
      get: function () {
        return this.hasAttribute("inert");
      },
      set: function (e) {
        t.setInert(this, e);
      },
    });
});
//# sourceMappingURL=inert.min.js.map
