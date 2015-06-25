/**
 * Created by derek on 2015/3/26.
 */

var auth = require('../config/auth');
//var enforceSingleSession = require('express-single-session')('id');

module.exports = function(app) {
    // User routes
    var users = require('../controllers/users');
    app.post('/auth/users', users.create);
    app.get('/auth/users', auth.ensureAuthenticated, users.show);
    app.put('/auth/users/', auth.ensureAuthenticated, users.update);
    app.delete('/auth/users/', auth.ensureAuthenticated, users.destroy);
    app.get('/auth/check_username/:username', users.exists);
    app.post('/auth/confirm_password/', auth.ensureAuthenticated, users.confirmPassword);

    // Session routes
    var session = require('../controllers/session');
    app.get('/auth/session', auth.ensureAuthenticated, session.session);
    app.post('/auth/session', session.login);
    app.delete('/auth/session', session.logout);

    // Comment routes
    var comments = require('../controllers/comments');
    app.get('/api/comments', auth.ensureAuthenticated, comments.get);
    app.post('/api/comments', auth.ensureAuthenticated, comments.create);
    app.get('/api/comments/:commentId', auth.ensureAuthenticated, comments.show);
    app.put('/api/comments/:commentId', auth.ensureAuthenticated, auth.comment.hasAuthorization, comments.update);
    app.delete('/api/comments/:commentId', auth.ensureAuthenticated, auth.comment.hasAuthorization, comments.destroy);

    app.param('commentId', comments.comment);

    var upload = require('../controllers/upload');
    app.get('/api/upload', auth.ensureAuthenticated, upload.get);
    app.post('/api/upload', auth.ensureAuthenticated, upload.post);
    app.delete('/uploaded/files/:name', auth.ensureAuthenticated, upload.delete);

    // Profile routes (head photos)
    var profile = require('../controllers/profile');
    //app.get('/api/profiles', auth.ensureAuthenticated, profile.get);
    app.get('/api/profile', auth.ensureAuthenticated, profile.newProfile);
    app.put('/api/profile/active', auth.ensureAuthenticated, profile.updateActive);

    // Tessel data api
    var tesselDataApi = require('../controllers/tessel/tessel-data-api');
    app.get('/api/tessel/data', tesselDataApi.getAll);
    app.post('/api/tessel/data', tesselDataApi.create);
    app.post('/api/tessel/data/arr', tesselDataApi.createMultiple);
    app.get('/api/tessel/data/files', tesselDataApi.getFileNames);
    app.get('/api/tessel/data/:dataId', tesselDataApi.show);
    app.put('/api/tessel/data/:dataId', tesselDataApi.update);
    app.delete('/api/tessel/data/:dataId', tesselDataApi.destroy);

    app.param('dataId', tesselDataApi.data);

    // Tessel analysis api
    var tesselAnalysisApi = require('../controllers/tessel/tessel-analysis-api');
    app.get('/api/tessel/analysis/:type/methods', tesselAnalysisApi.getMethods);
    app.get('/api/tessel/analysis/:jsonFileName/:dataType/:method', tesselAnalysisApi.analyze);

    app.param('jsonFileName', tesselAnalysisApi.parseJSONFile);
    app.param('dataType', tesselAnalysisApi.getData);
    app.param('method', tesselAnalysisApi.getMethod);

    // Tessel picture api
    var tesselPictureApi = require('../controllers/tessel/tessel-picture-api');
    app.get('/api/tessel/pictures', tesselPictureApi.getPictures);
    app.post('/api/tessel/pictures', tesselPictureApi.savePictures);

    // Tessel rfid-picture api
    var tesselRfidPictureApi = require('../controllers/tessel/tessel-rfid-picture-api');
    app.get('/api/tessel/rfid_pictures/:permission', auth.ensureAuthenticated, auth.rfid.checkIdentity, tesselRfidPictureApi.getPictures);

    app.param('permission', tesselRfidPictureApi.permission);

    // Tessel rfid api
    var tesselRfidApi = require('../controllers/tessel/tessel-rfid-api');
    app.get('/api/tessel/rfid', auth.ensureAuthenticated, tesselRfidApi.registerRfid);
    app.get('/api/tessel/rfids', auth.ensureAuthenticated, tesselRfidApi.getAll);
    app.get('/api/tessel/rfid/:rfidId', auth.ensureAuthenticated, auth.rfid.hasAuthorization, tesselRfidApi.show);
    app.put('/api/tessel/rfid/:rfidId', auth.ensureAuthenticated, auth.rfid.hasAuthorization, tesselRfidApi.update);
    app.delete('/api/tessel/rfid/:rfidId', auth.ensureAuthenticated, auth.rfid.hasAuthorization, tesselRfidApi.destroy);

    app.param('rfidId', tesselRfidApi.rfid);

    // serve index and view pages
    var routes = require('../controllers/index');
    app.get('/', routes.index);
    app.get('/partials/:name', routes.pages);

    // redirect all others to the index (HTML5 history)
    app.get('*', routes.index);
};