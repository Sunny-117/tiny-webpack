const less = require('less')

function loader(content) {
  const callback = this.async() // callback: 会把loader的执行变成异步的,不会继续往下执行了，直到调用callback的时候继续执行
  less.render(content, {filename: this.resource}, (err, output)=>{
    callback(err, output.css) // 让loader继续往下执行
  })

}

module.exports = loader;
