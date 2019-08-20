export default {
	setRoutes: (app) => {
		app.get('/', (req, res) => res.send('Hello World!'));
	}
}
