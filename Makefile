DB_URL=postgresql://root:secret@localhost:5432/luka_ndaku?sslmode=disable
DB_NAME=luka_ndaku
CONTAINER_NAME=postgres

postgres:
	docker run --name "$(CONTAINER_NAME)" -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgis/postgis:14-3.3

createdb:
	docker exec -it "$(CONTAINER_NAME)" createdb --username=root --owner=root "$(DB_NAME)"

dropdb:
	docker exec -it "$(CONTAINER_NAME)" dropdb "$(DB_NAME)"

enable-postgis:
	docker exec -it "$(CONTAINER_NAME)" \
	psql -U root -d postgres \
	-c "CREATE EXTENSION IF NOT EXISTS postgis;"

redis:
	docker run --name redis -p 6379:6379 -d redis:7-alpine

.PHONY: postgres createdb dropdb  redis enable-postgis
