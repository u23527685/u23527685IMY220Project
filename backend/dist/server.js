"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var api = _interopRequireWildcard(require("../api.js"));
var _excluded = ["_id"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t1 in e) "default" !== _t1 && {}.hasOwnProperty.call(e, _t1) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t1)) && (i.get || i.set) ? o(f, _t1, i) : f[_t1] = e[_t1]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
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

// api calls

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
app.put("/api/user", /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(req, res) {
    var _req$body, _id, updateData, response, _t;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          _context0.p = 0;
          _req$body = req.body, _id = _req$body._id, updateData = _objectWithoutProperties(_req$body, _excluded);
          if (!(!_id || typeof _id !== 'string')) {
            _context0.n = 1;
            break;
          }
          return _context0.a(2, res.status(400).json({
            success: false,
            message: 'User  ID is required and must be a string'
          }));
        case 1:
          _context0.n = 2;
          return api.updateUserInfo(req.body);
        case 2:
          response = _context0.v;
          if (response.success) {
            res.status(200).json(response);
          } else {
            res.status(400).json(response);
          }
          _context0.n = 4;
          break;
        case 3:
          _context0.p = 3;
          _t = _context0.v;
          console.error("Error updating user: ", _t);
          res.status(500).json({
            success: false,
            message: 'Internal server error'
          });
        case 4:
          return _context0.a(2);
      }
    }, _callee0, null, [[0, 3]]);
  }));
  return function (_x17, _x18) {
    return _ref0.apply(this, arguments);
  };
}());
app.put("/api/project", /*#__PURE__*/function () {
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
app.post('/api/friends/request', /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(req, res) {
    var _req$body2, receiverId, senderId, response, _t2;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.p = _context11.n) {
        case 0:
          _context11.p = 0;
          _req$body2 = req.body, receiverId = _req$body2.receiverId, senderId = _req$body2.senderId; // Check for self-request
          if (!(senderId === receiverId)) {
            _context11.n = 1;
            break;
          }
          return _context11.a(2, res.status(400).json({
            success: false,
            message: 'Cannot send friend request to yourself'
          }));
        case 1:
          _context11.n = 2;
          return api.sendFriendRequest(senderId, receiverId);
        case 2:
          response = _context11.v;
          res.status(response.success ? 200 : 400).json(response);
          _context11.n = 4;
          break;
        case 3:
          _context11.p = 3;
          _t2 = _context11.v;
          console.error('Error in send friend request route:', _t2);
          res.status(500).json({
            success: false,
            message: 'Server error'
          });
        case 4:
          return _context11.a(2);
      }
    }, _callee11, null, [[0, 3]]);
  }));
  return function (_x23, _x24) {
    return _ref11.apply(this, arguments);
  };
}());
app.post('/api/friends/accept', /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(req, res) {
    var _req$body3, senderId, receiverId, response, _t3;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.p = _context12.n) {
        case 0:
          _context12.p = 0;
          _req$body3 = req.body, senderId = _req$body3.senderId, receiverId = _req$body3.receiverId; // Check for self-accept
          if (!(receiverId === senderId)) {
            _context12.n = 1;
            break;
          }
          return _context12.a(2, res.status(400).json({
            success: false,
            message: 'Cannot accept your own request'
          }));
        case 1:
          _context12.n = 2;
          return api.acceptFriendRequest(receiverId, senderId);
        case 2:
          response = _context12.v;
          res.status(response.success ? 200 : 400).json(response);
          _context12.n = 4;
          break;
        case 3:
          _context12.p = 3;
          _t3 = _context12.v;
          console.error('Error in accept friend request route:', _t3);
          res.status(500).json({
            success: false,
            message: 'Server error'
          });
        case 4:
          return _context12.a(2);
      }
    }, _callee12, null, [[0, 3]]);
  }));
  return function (_x25, _x26) {
    return _ref12.apply(this, arguments);
  };
}());
app.post('/api/friends/decline', /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(req, res) {
    var _req$body4, senderId, receiverId, response, _t4;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.p = _context13.n) {
        case 0:
          _context13.p = 0;
          _req$body4 = req.body, senderId = _req$body4.senderId, receiverId = _req$body4.receiverId; // Check for self-decline
          if (!(receiverId === senderId)) {
            _context13.n = 1;
            break;
          }
          return _context13.a(2, res.status(400).json({
            success: false,
            message: 'Cannot decline your own request'
          }));
        case 1:
          _context13.n = 2;
          return api.declineFriendRequest(receiverId, senderId);
        case 2:
          response = _context13.v;
          res.status(response.success ? 200 : 400).json(response);
          _context13.n = 4;
          break;
        case 3:
          _context13.p = 3;
          _t4 = _context13.v;
          console.error('Error in decline friend request route:', _t4);
          res.status(500).json({
            success: false,
            message: 'Server error'
          });
        case 4:
          return _context13.a(2);
      }
    }, _callee13, null, [[0, 3]]);
  }));
  return function (_x27, _x28) {
    return _ref13.apply(this, arguments);
  };
}());
app.post('/api/friends/remove', /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(req, res) {
    var _req$body5, friendId, userId, response, _t5;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.p = _context14.n) {
        case 0:
          _context14.p = 0;
          _req$body5 = req.body, friendId = _req$body5.friendId, userId = _req$body5.userId; // Check for self-remove
          if (!(userId === friendId)) {
            _context14.n = 1;
            break;
          }
          return _context14.a(2, res.status(400).json({
            success: false,
            message: 'Cannot remove yourself as a friend'
          }));
        case 1:
          _context14.n = 2;
          return api.removeFriend(userId, friendId);
        case 2:
          response = _context14.v;
          res.status(response.success ? 200 : 400).json(response);
          _context14.n = 4;
          break;
        case 3:
          _context14.p = 3;
          _t5 = _context14.v;
          console.error('Error in remove friend route:', _t5);
          res.status(500).json({
            success: false,
            message: 'Server error'
          });
        case 4:
          return _context14.a(2);
      }
    }, _callee14, null, [[0, 3]]);
  }));
  return function (_x29, _x30) {
    return _ref14.apply(this, arguments);
  };
}());
app.post("/api/activity", /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(req, res) {
    var response, _t6;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.p = _context15.n) {
        case 0:
          _context15.p = 0;
          _context15.n = 1;
          return api.addActivityEntry(req.body);
        case 1:
          response = _context15.v;
          res.status(response.success ? 200 : 400).json(response);
          _context15.n = 3;
          break;
        case 2:
          _context15.p = 2;
          _t6 = _context15.v;
          console.error('Error in remove friend route:', _t6);
          res.status(500).json({
            success: false,
            message: 'Server error'
          });
        case 3:
          return _context15.a(2);
      }
    }, _callee15, null, [[0, 2]]);
  }));
  return function (_x31, _x32) {
    return _ref15.apply(this, arguments);
  };
}());
app.post("/api/discussion", /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(req, res) {
    var response, _t7;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.p = _context16.n) {
        case 0:
          _context16.p = 0;
          _context16.n = 1;
          return api.addDiscussionEntry(req.body);
        case 1:
          response = _context16.v;
          res.status(response.success ? 200 : 400).json(response);
          _context16.n = 3;
          break;
        case 2:
          _context16.p = 2;
          _t7 = _context16.v;
          console.error('Error in remove friend route:', _t7);
          res.status(500).json({
            success: false,
            message: 'Server error'
          });
        case 3:
          return _context16.a(2);
      }
    }, _callee16, null, [[0, 2]]);
  }));
  return function (_x33, _x34) {
    return _ref16.apply(this, arguments);
  };
}());

// DELETE /api/projects/:projectId - Delete a project (requires auth, must be owner)
app["delete"]('/api/projects/:projectId/:requesterId', /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(req, res) {
    var _req$params, projectId, requesterId, response, _t8;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.p = _context17.n) {
        case 0:
          _context17.p = 0;
          _req$params = req.params, projectId = _req$params.projectId, requesterId = _req$params.requesterId; // Validate projectId format
          if (projectId) {
            _context17.n = 1;
            break;
          }
          return _context17.a(2, res.status(400).json({
            success: false,
            message: 'project id needed'
          }));
        case 1:
          _context17.n = 2;
          return api.deleteProject(projectId, requesterId);
        case 2:
          response = _context17.v;
          res.status(response.success ? 200 : 400).json(response);
          _context17.n = 4;
          break;
        case 3:
          _context17.p = 3;
          _t8 = _context17.v;
          console.error('Error in delete project route:', _t8);
          res.status(500).json({
            success: false,
            message: 'Server error'
          });
        case 4:
          return _context17.a(2);
      }
    }, _callee17, null, [[0, 3]]);
  }));
  return function (_x35, _x36) {
    return _ref17.apply(this, arguments);
  };
}());

// DELETE /api/users/:userId - Delete a user (requires auth, must be self)
app["delete"]('/api/users/:userId/:requesterId', /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(req, res) {
    var _req$params2, userId, requesterId, response, _t9;
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.p = _context18.n) {
        case 0:
          _context18.p = 0;
          _req$params2 = req.params, userId = _req$params2.userId, requesterId = _req$params2.requesterId; // Validate userId format and ensure self-deletion
          if (userId) {
            _context18.n = 1;
            break;
          }
          return _context18.a(2, res.status(400).json({
            success: false,
            message: 'UserId needed'
          }));
        case 1:
          if (!(userId !== requesterId)) {
            _context18.n = 2;
            break;
          }
          return _context18.a(2, res.status(403).json({
            success: false,
            message: 'You can only delete your own account'
          }));
        case 2:
          _context18.n = 3;
          return api.deleteUser(userId, requesterId);
        case 3:
          response = _context18.v;
          res.status(response.success ? 200 : 400).json(response);
          _context18.n = 5;
          break;
        case 4:
          _context18.p = 4;
          _t9 = _context18.v;
          console.error('Error in delete user route:', _t9);
          res.status(500).json({
            success: false,
            message: 'Server error'
          });
        case 5:
          return _context18.a(2);
      }
    }, _callee18, null, [[0, 4]]);
  }));
  return function (_x37, _x38) {
    return _ref18.apply(this, arguments);
  };
}());

//api
function startServer() {
  return _startServer.apply(this, arguments);
}
function _startServer() {
  _startServer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20() {
    var _t0;
    return _regenerator().w(function (_context20) {
      while (1) switch (_context20.p = _context20.n) {
        case 0:
          _context20.p = 0;
          _context20.n = 1;
          return api.connectToMongoDB();
        case 1:
          app.listen(port, function () {
            console.log("Database running on http://localhost:".concat(port));
          });
          _context20.n = 3;
          break;
        case 2:
          _context20.p = 2;
          _t0 = _context20.v;
          console.error('Failed to start server:', _t0);
          process.exit(1);
        case 3:
          return _context20.a(2);
      }
    }, _callee20, null, [[0, 2]]);
  }));
  return _startServer.apply(this, arguments);
}
app.listen(port, function () {
  console.log("Veyo app Listening on http://localhost:".concat(port));
});
process.on('SIGINT', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19() {
  return _regenerator().w(function (_context19) {
    while (1) switch (_context19.n) {
      case 0:
        console.log('\nShutting down gracefully...');
        _context19.n = 1;
        return api.closeDatabaseConnection();
      case 1:
        process.exit(0);
      case 2:
        return _context19.a(2);
    }
  }, _callee19);
})));
startServer();