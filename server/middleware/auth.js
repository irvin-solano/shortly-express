const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  //console.log(req);
  if (Object.keys(req.cookies).length === 0) { //no cookies at all
    models.Sessions.create()
      .then((result) => {
        models.Sessions.get({ id: result.insertId })
          .then((result) => {
            req.session = { 'hash': result.hash };
            res.cookie('shortlyid', result.hash);
            next();
          });
      })
      .catch((err) => {
        next();
      });
  } else if (Object.keys(req.cookies).includes('shortlyid')) {
    models.Sessions.get({'hash': req.cookies.shortlyid})
      .then((result) => {
        req.session = { 'hash': req.cookies.shortlyid };
        if (result.user !== undefined) {
          req.session.user = { 'username': result.user.username };
          req.session.userId = result.user.id;
        }
        next();
      })
      .catch((err) => {
        req.cookies = {};
        this.createSession(req, res, next);
        next();
      });

  }

};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

// TODO EVERYONE GET 🍪s
/**
 * First time users
 * - No Cookie
 * - No Session
 *
 * 1. Create a session
 * 2. Set a cookie for them
 */
/**
 * Returning Users
 * 1. check that cookie
 * 2. see the session associated with them
 *   |Session Table |
 *   ________________
 *   | id | user_id |
 *   ----------------
 *   | 3  | null    |
 */

// TODO Upgrade with users ⬆️

/**
  * Logging In User
  * 1. associate their session to a user
  *   |Session Table |
  *   ________________
  *   | id | user_id |
  *   ----------------
  *   | 3  |   9871  |
  */

/**
  * Returning Logged In User
  * 1. check the session
  * 2. if associated user -> permission granted...?
  *   |Session Table |
  *   ________________
  *   | id | user_id |
  *   ----------------
  *   | 3  | 9871    |  <- does this user have access to the resource?
  */

/**
  * Logout
  * 1. 🔥 that session and cookie to the ground (a.k.a unassociate user with session)
  *
  *    === Before ===
  *   |Session Table |
  *   ________________
  *   | id | user_id |
  *   ----------------
  *   | 3  | 9871    |
  *
  *    === After ===
  *   |Session Table |
  *   ________________
  *   | id | user_id |
  *   ----------------
  *   | 3  | null    |   <- or remove the whoe session with delete and make a new one
  */