function loaderA(source) {
    console.log('normalA');
    return source;
}
loaderA.pitch = () => console.log('pitchA');
module.exports = loaderA