const { render } = require('less')

module.exports = function (source) {
  console.log('less-loader')
  render(source, (err, output) => {
    this.callback(err, output.css)
  })
}
