exports.logging = (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`)
  return next()
}