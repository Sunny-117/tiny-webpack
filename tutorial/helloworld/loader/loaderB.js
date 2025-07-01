function loaderB(source) {
    console.log('normalB');
    return source;
}
loaderB.pitch = () => {
    console.log('pitchB');
    return 'pitchBResult';
};
module.exports = loaderB;
