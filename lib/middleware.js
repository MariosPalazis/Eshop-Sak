export default {
  subRoutes(req, res, next) {
    let subRoutes = req.url.match(/\//g).length;
    let pathDepth = "";
    --subRoutes;

    if (subRoutes != 0) {
      for(let i = 0; i < subRoutes; ++i) {
        pathDepth += "../";
      }
    }
    res.locals.subRoutes = pathDepth;
    next();
  },

  flashMessages(req, res, next) {
    if (req.session.state && req.session.state.flashMessages && req.session.state.flashMessages.length !== 0) {
      res.locals.flashMessages = req.session.state.flashMessages.slice();
      req.session.state.flashMessages.forEach((element, index) => {
        if (!element.persistent) req.session.state.flashMessages.splice(index, 1);
      })
    }

    if (req.session.state && req.session.state.flashMessages && req.session.state.flashMessages.length === 0) delete req.session.state.flashMessages;
    next();
  },

  stateShoppingCart(req, res, next) {
    if (req.session.state && req.session.state.stateCart &&
        req.session.state.stateCart.meta &&
        req.session.state.stateCart.meta.totalAmount !== 0) {
      res.locals.stateCart = req.session.state.stateCart;
    }
    next();
  },

  stateAddress(req, res, next) {
    if (req.session.state && req.session.state.stateAddress &&
        (Object.keys(req.session.state.stateAddress).length !== 0 &&
         req.session.state.stateAddress.constructor === Object)) {
      res.locals.stateAddress = req.session.state.stateAddress;
    }
    next();
  },

  statePaymentCard(req, res, next) {
    if (req.session.state && req.session.state.statePaymentCard &&
        (Object.keys(req.session.state.statePaymentCard).length !== 0 &&
         req.session.state.statePaymentCard.constructor === Object)) {
      res.locals.statePaymentCard = req.session.state.statePaymentCard;
    }
    next();
  },

  isUsername(req, res, next) {
    if (req.session.state && req.session.state.login && req.session.state.login.loggedIn) {
      if (req.session.state.user && req.session.state.user.username) res.locals.username = req.session.state.user.username;
    }
    next();
  },

  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect(303, "/login");
    }
  },

  }
