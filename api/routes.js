exports.setRoutes = (app) => {
    app.get('/', (req, res) => res.send('Hello World!'));

	//    app.get('/check', db.checkToken);
	//    app.post('/connect', db.login);
	//    app.post('/logout', db.logout);
	//    app.post('/locate', db.locate);
	//    app.post('/upload_picture', up.single('file'), upload.upload);
}
