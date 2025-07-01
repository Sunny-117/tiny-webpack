function loaderC(source) {
    console.log('normalC');
    return source + '-C';
}
loaderC.pitch = () => console.log('pitchC');
module.exports = loaderC;