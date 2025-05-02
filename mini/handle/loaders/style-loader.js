module.exports = function (source) {
  console.log('style-loader')
  const str = `
      let style = document.createElement('style');
      style.innerHTML = ${JSON.stringify(source)};
      document.head.appendChild(style);
    `
  return str
}
