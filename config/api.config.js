const isPro = Object.is(process.env.NODE_ENV, 'production')

module.exports = {
  baseURL: isPro ? 'http://47.94.89.18/api/' :'api/'
}
