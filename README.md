# Matcha
Stack: 
 - NodeJS + Express
 - React
 - Neo4j (GraphQL)

## Setup - compose only
```
git clone https://github.com/alexandregv/Matcha.git
cd Matcha
docker-compose build
docker-compose up -d
open http://localhost:8080
```

## Setup - compose + machine
```
git clone git@github.com:alexandregv/Matcha.git
cd Matcha
docker-machine create --driver virtualbox --virtualbox-memory 4096 --virtualbox-cpu-count 4 Matcha
docker-machine start Matcha
eval $(docker-machine env Matcha) 
docker-compose build
docker-compose up -d
open http://$(docker-machine ip Matcha):8080
```

## Contributors
[`alexandregv (aguiot--)`](https://github.com/alexandregv) - Alexandre Guiot--Valentin  
[`sophiebl (sboulaao)`](https://github.com/sophiebl) - Sophie Boulaaouli  
