function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}
exports.a = 1;
exports.sleep = sleep;
