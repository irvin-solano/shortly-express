
const parseCookies = (req, res, next) => {

  var cookies = {};
  if (req.headers.cookie !== undefined) {
    if (req.headers.cookie.indexOf(';') !== -1) {
      var array = req.headers.cookie.split('; ');
      array.forEach((item) => {
        var item = item.split('=');
        cookies[item[0]] = item[1];
      });
    } else {
      var string = req.headers.cookie;
      var sepIndex = string.indexOf('=');
      cookies[string.slice(0, sepIndex)] = string.slice(sepIndex + 1, string.length);
    }
  }

  req.cookies = cookies;
  next();
};

module.exports = parseCookies;