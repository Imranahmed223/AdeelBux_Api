const express = require("express");
const authRoute = require("./auth.route");
const adminRoute = require("./admin.route");
const userRoute = require("./user.route");
const accountRoute = require("./account.route");
const transcationRoute = require("./transaction.route");
const router = express.Router();

const defaultRoutes = [
  {
    path: "/v1/app/auth",
    route: authRoute,
  },
  {
    path: "/v1/app/admin",
    route: adminRoute,
  },
  {
    path: "/v1/app/user",
    route: userRoute,
  },
  {
    path: "/v1/app/account",
    route: accountRoute,
  },
  {
    path: "/v1/app/transaction",
    route: transcationRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
