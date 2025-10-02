"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var api = _interopRequireWildcard(require("../api.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t2 in e) "default" !== _t2 && {}.hasOwnProperty.call(e, _t2) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t2)) && (i.get || i.set) ? o(f, _t2, i) : f[_t2] = e[_t2]); return f; })(e, t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var express = require("express");
var path = require("path");
var app = express();
var port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express["static"]("frontend/public"));

// Handle all React Router routes
app.get('/', function (req, res) {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});
app.get('/home', function (req, res) {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});
app.get('/profile', function (req, res) {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});
app.get('/profile/:username', function (req, res) {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});
app.get('/projects/:username', function (req, res) {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});
app.get('/projects/:username/:name/:owner', function (req, res) {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});
app.get('/project/:name/:owner', function (req, res) {
  res.sendFile(path.resolve('frontend', 'public', 'index.html'));
});
app.get("/api/projects", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var projects;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.n = 1;
          return api.getAllProjects();
        case 1:
          projects = _context.v;
          res.json(projects);
        case 2:
          return _context.a(2);
      }
    }, _callee);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.get("/api/projects/:userid", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var userid, projects;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          userid = req.params.userid;
          _context2.n = 1;
          return api.userProjects(userid);
        case 1:
          projects = _context2.v;
          res.json(projects);
        case 2:
          return _context2.a(2);
      }
    }, _callee2);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
app.post("/api/signup", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var newuser;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.n = 1;
          return api.signupUser(req.body);
        case 1:
          newuser = _context3.v;
          res.json(newuser);
        case 2:
          return _context3.a(2);
      }
    }, _callee3);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
app.post("/api/login", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var newuser;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return api.authenticateUser(req.body);
        case 1:
          newuser = _context4.v;
          res.json(newuser);
        case 2:
          return _context4.a(2);
      }
    }, _callee4);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
app.post("/api/project/feed", /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var feed;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _context5.n = 1;
          return api.getActivityFeed(req.body);
        case 1:
          feed = _context5.v;
          res.json(feed);
        case 2:
          return _context5.a(2);
      }
    }, _callee5);
  }));
  return function (_x9, _x0) {
    return _ref5.apply(this, arguments);
  };
}());
app.post("/api/project/discussions", /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var feed;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          _context6.n = 1;
          return api.getDiscussions(req.body);
        case 1:
          feed = _context6.v;
          res.json(feed);
        case 2:
          return _context6.a(2);
      }
    }, _callee6);
  }));
  return function (_x1, _x10) {
    return _ref6.apply(this, arguments);
  };
}());
app.get("/api/types", /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
    var projects;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          _context7.n = 1;
          return api.getAllTypes();
        case 1:
          projects = _context7.v;
          res.json(projects);
        case 2:
          return _context7.a(2);
      }
    }, _callee7);
  }));
  return function (_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}());
app.get("/api/types/:typeid", /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(req, res) {
    var typeid, projects;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          typeid = req.params.typeid;
          _context8.n = 1;
          return api.getProjectType(typeid);
        case 1:
          projects = _context8.v;
          res.json(projects);
        case 2:
          return _context8.a(2);
      }
    }, _callee8);
  }));
  return function (_x13, _x14) {
    return _ref8.apply(this, arguments);
  };
}());
app.get("/api/user/:userid", /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(req, res) {
    var userid, user;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          userid = req.params.userid;
          _context9.n = 1;
          return api.getUser(userid);
        case 1:
          user = _context9.v;
          res.json(user);
        case 2:
          return _context9.a(2);
      }
    }, _callee9);
  }));
  return function (_x15, _x16) {
    return _ref9.apply(this, arguments);
  };
}());
app.post("/api/updateuser", /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(req, res) {
    var response;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          _context0.n = 1;
          return api.updateUserInfo(req.body);
        case 1:
          response = _context0.v;
          res.json(response);
        case 2:
          return _context0.a(2);
      }
    }, _callee0);
  }));
  return function (_x17, _x18) {
    return _ref0.apply(this, arguments);
  };
}());
app.post("/api/updateproject", /*#__PURE__*/function () {
  var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(req, res) {
    var response;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          _context1.n = 1;
          return api.updateProject(req.body);
        case 1:
          response = _context1.v;
          res.json(response);
        case 2:
          return _context1.a(2);
      }
    }, _callee1);
  }));
  return function (_x19, _x20) {
    return _ref1.apply(this, arguments);
  };
}());
app.post("/api/projects/create", /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(req, res) {
    var ownerId, response;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.n) {
        case 0:
          ownerId = req.body.ownerId;
          _context10.n = 1;
          return api.createProject(req.body, ownerId);
        case 1:
          response = _context10.v;
          res.json(response);
        case 2:
          return _context10.a(2);
      }
    }, _callee10);
  }));
  return function (_x21, _x22) {
    return _ref10.apply(this, arguments);
  };
}());
function startServer() {
  return _startServer.apply(this, arguments);
}
function _startServer() {
  _startServer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
    var _t;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.p = _context12.n) {
        case 0:
          _context12.p = 0;
          _context12.n = 1;
          return api.connectToMongoDB();
        case 1:
          app.listen(port, function () {
            console.log("Database running on http://localhost:".concat(port));
          });
          _context12.n = 3;
          break;
        case 2:
          _context12.p = 2;
          _t = _context12.v;
          console.error('Failed to start server:', _t);
          process.exit(1);
        case 3:
          return _context12.a(2);
      }
    }, _callee12, null, [[0, 2]]);
  }));
  return _startServer.apply(this, arguments);
}
app.listen(port, function () {
  console.log("Veyo app Listening on http://localhost:".concat(port));
});
process.on('SIGINT', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
  return _regenerator().w(function (_context11) {
    while (1) switch (_context11.n) {
      case 0:
        console.log('\nShutting down gracefully...');
        _context11.n = 1;
        return api.closeDatabaseConnection();
      case 1:
        process.exit(0);
      case 2:
        return _context11.a(2);
    }
  }, _callee11);
})));
startServer();