# Matcha
## The project

Matcha is a dating platform with the following features:

* 💘 matching algorithm based on preferences, distance, common interests and popularity rates
* 🛎 real-time notifications
* 💌 chat
* 🚫 possibility to block or report a userr

## The stack
### Back
* [Node](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [Neo4j](https://neo4j.com/)

### Front
* [React](https://reactjs.org/)
* [Material-Ui](https://material-ui.com/) : React UI framework

### Server
* [Docker](https://www.docker.com/)

## How to quickly try it?
## Setup (you just need *Make* and *Docker*)
```
git clone https://github.com/alexandregv/Matcha.git
cd Matcha
make
open http://localhost:3000
```

### API we used
* [Unplash](https://unsplash.com/developers)
* [Fakerator](https://www.npmjs.com/package/fakerator) : to generate fake profiles for the seed

## What it looks like

[![Home](https://www.sophieboulaaouli.com/images/Matcha_desktop.jpg)](https://www.sophieboulaaouli.com/images/Matcha_desktop.jpg)
[![Match](https://www.sophieboulaaouli.com/images/matcha-mobile.png)](https://www.sophieboulaaouli.com/images/matcha-mobile.png)

[![User Profile](https://www.sophieboulaaouli.com/images/matcha-myprofile.png)](https://www.sophieboulaaouli.com/images/matcha-myprofile.png)

[![Chat](https://www.sophieboulaaouli.com/images/matcha-conv.png)](https://www.sophieboulaaouli.com/images/matcha-conv.png)

## How we've been working
* 🗓 Planning the project on Github Kanban : [The Project Board](https://github.com/alexandregv/Matcha/projects/1)

## Handy commands
- `make up`: Up the stack
- `make down`: Down the stack

- `make ls`: List stack services
- `make ps`: Show stack services details

- `make dump-db`: Dump the database into a single file (`db/data/graph.db.dump`)
- `make load-db`: Load the database from the dump file

## Full commands list
- `make build`: Build images

- `make init`: Create a swarm
- `make leave`: Leave the swarm

- `make start`: Start the stack
- `make stop`: Stop the stack

- `make up`: Up the stack
- `make down`: Down the stack

- `make reload`: Reload the stack
- `make fix`: Fix a possible problem to start the stack (occurs if you down/stop too fast after an up/sart)

- `make ls`: List stack services
- `make ps`: Show stack services details

- `make init-db`: (Re)Initialize an empty neo4j database (will prompt for reset)
- `make dump-db`: Dump the database into a single file (`db/data/graph.db.dump`)
- `make load-db`: Load the database from the dump file

**Actually, you should only have to use `up`/`down`, `ls`/`ps` and `dump`/`load`.**  
Others commands are here mainly for development purposes.  
Also, if you see some errors marked as `(ignored)`: **this is normal**.  

## Credits

👨🏻‍💻👩🏻‍💻
Built and designed by 
[@alexandregv](https://github.com/alexandregv) & [@sophiebl](https://github.com/sophiebl/)
