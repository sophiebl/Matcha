# Matcha
Stack: 
 - NodeJS + Express
 - React
 - Neo4j (GraphQL)
 - Docker

## Setup (you just need *Make* and *Docker*)
```
git clone https://github.com/alexandregv/Matcha.git
cd Matcha
make
open http://localhost:3000
```

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

## Contributors
[`alexandregv (aguiot--)`](https://github.com/alexandregv) - Alexandre Guiot--Valentin  
[`sophiebl (sboulaao)`](https://github.com/sophiebl) - Sophie Boulaaouli  
