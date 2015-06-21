/**
 * Created by derek on 2015/3/26.
 */
module.exports = {
    port: process.env.PORT || 1234,
    secret: 'passion',
    db: {
        host: 'localhost',
        port: 6379
    },
    tesselRfid: {
        host: '192.168.0.117',
        port: 1234,
        timeout: 5000
    }
};