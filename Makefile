# Config
STACK=matcha

# Cross-platforms
ECHO 		= echo
ifeq ($(shell uname),Linux)
	ECHO	+= -e
endif

# Colors
C_INFO		= \033[0;36m
C_PENDING	= \033[0;33m
C_SUCCESS	= \033[0;32m
C_RESET		= \033[0m

all: init-db load-db up

# --- STACK --- #

build:
	@$(ECHO) "$(C_PENDING)\nBuilding images...$(C_RESET)"
	@docker-compose build
	@$(ECHO) "$(C_SUCCESS)Images have been built successfully.$(C_RESET)"

init:
	@$(ECHO) "$(C_PENDING)\nCreating a new swarm...$(C_RESET)"
	@docker swarm init --advertise-addr 127.0.0.1
	@$(ECHO) "$(C_SUCCESS)Created swarm.$(C_RESET)"

leave:
	@$(ECHO) "$(C_PENDING)\nLeaving swarm...$(C_RESET)"
	@docker swarm leave --force
	@$(ECHO) "$(C_SUCCESS)Left swarm.$(C_RESET)"

start:
	@$(ECHO) "$(C_PENDING)\nDeploying stack...$(C_RESET)"
	@docker stack deploy -c docker-compose.yml ${STACK}
	@$(ECHO) "$(C_SUCCESS)Deployed stack.$(C_RESET)"

stop:
	@$(ECHO) "$(C_PENDING)\nStopping stack...$(C_RESET)"
	-@docker stack rm ${STACK}
	@$(ECHO) "$(C_SUCCESS)Stoped stack.$(C_RESET)"

up:
	-@$(MAKE) init
	-@$(MAKE) start
	@$(ECHO) ""
	@docker service ls

down:
	-@$(MAKE) stop
	-@$(MAKE) leave

reload:
	@$(ECHO) "$(C_PENDING)\nReloading stack...$(C_RESET)"
	@docker stack deploy -c docker-compose.yml ${STACK}
	@$(ECHO) "$(C_SUCCESS)Reloaded stack.$(C_RESET)"

ls:
	@docker stack services ${STACK}

ps:
	@docker ps --format 'table {{.ID}}\t{{.Image}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}'
	@echo '------------'
	@docker service ls -q | xargs docker service ps --format 'table {{.ID}}\t{{.Image}}\t{{.Name}}\t{{.DesiredState}}\t{{.CurrentState}}\t{{.Error}}'

logs:
	@docker stack services ${STACK} --format '{{.Name}}' | xargs  -I % sh -c ' echo "\n$(C_INFO)---------- [ % ] ----------$(C_RESET)\n"; docker service logs --raw %;'

stats:
	@docker stats --no-stream --format 'table {{.Container}}\t{{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}'

fix:
	@$(ECHO) "$(C_PENDING)\nTrying to fix (force removing network)...$(C_RESET)"
	docker network disconnect -f $(docker network inspect matcha_default -f "{{.Id}}") matcha_default-endpoint
	docker network prune -f
	@$(ECHO) "$(C_SUCCESS)Fixed it!$(C_RESET)"

# --- DB --- #

init-db:
	@$(ECHO) "$(C_PENDING)\nInitializing empty datasbase...$(C_RESET)"
ifneq ($(wildcard db/data/databases/graph.db),)
	@stty -echo; read -n1 -p "Reset existing database ? [y/N]: " pwd; stty echo; echo $$pwd; if [ "$$pwd" = "y" ]; then rm -r ./db/data/databases/graph.db; echo "$(C_SUCCESS)Reseted database.$(C_RESET)"; fi
endif
	@docker run -it --rm -v ${CURDIR}/db/data:/data neo4j /bin/bash -c "neo4j start; echo 'Waiting for database to be created..'; sleep 3; echo 'Database should be OK now.'; neo4j stop"
	@$(ECHO) "$(C_SUCCESS)Initialized empty datasbase.$(C_RESET)"

dump-db:
	@$(ECHO) "$(C_PENDING)\nDumping database to db/data/graph.db.dump$(C_RESET)"
	-@docker service scale matcha_db=0
	@docker run -it --rm -v ${CURDIR}/db/data:/data neo4j /bin/bash -c "rm /data/graph.db.dump; neo4j-admin dump --to /data"
	-@docker service scale matcha_db=1
	@$(ECHO) "$(C_SUCCESS)Dumped database$(C_RESET)"

load-db:
	@$(ECHO) "$(C_PENDING)\nLoading database from db/data/graph.db.dump$(C_RESET)"
	-@docker service scale matcha_db=0
	@docker run -it --rm -v ${CURDIR}/db/data:/data neo4j /bin/bash -c "neo4j-admin load --from /data/graph.db.dump --force"
	-@docker service scale matcha_db=1
	@$(ECHO) "$(C_SUCCESS)Imported database.$(C_RESET)"
