STACK=matcha
PWD=$(shell pwd)

# --- STACK --- #

init:
	docker swarm init

leave:
	docker swarm leave --force

up:
	docker swarm init
	docker stack deploy -c docker-compose.yml ${STACK}
	docker service ls

down:
	docker stack rm ${STACK}
	docker swarm leave --force

reload:
	docker stack deploy -c docker-compose.yml ${STACK}

ls:
	@docker stack services ${STACK}

ps:
	@docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"
	@echo "------------"
	@docker service ls -q | xargs docker service ps

fix:
	docker network disconnect -f $(docker network inspect matcha_default -f '{{.Id}}') matcha_default-endpoint
	docker network prune -f

# --- DB --- #

dump:
	docker service scale matcha_db=0
	docker run -it --rm -v ${PWD}/db/data:/data neo4j /bin/bash -c 'rm /data/graph.db.dump; neo4j-admin dump --to /data'
	docker service scale matcha_db=1

load:
	docker service scale matcha_db=0
	docker run -it --rm -v ${PWD}/db/data:/data neo4j /bin/bash -c 'neo4j-admin load --from /data/graph.db.dump --force'
	docker service scale matcha_db=1
