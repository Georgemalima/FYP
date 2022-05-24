const res = require("express/lib/response");

module.exports = func => (req, res, next) =>
         Promise.resolve(func(req, res, next))
                    .catch(next);