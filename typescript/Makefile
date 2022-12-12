build-api:
	docker build . -f packages/api/Dockerfile -t "api:$$(git rev-parse --short HEAD)"

build-and-push-api:
	docker build . -f packages/api/Dockerfile -t "api:$$(git rev-parse --short HEAD)"
	docker tag "api:$$(git rev-parse --short HEAD)" us-central1-docker.pkg.dev/proud-amphora-371018/songbird-assets/api:$$(git rev-parse --short HEAD)
	docker push us-central1-docker.pkg.dev/proud-amphora-371018/songbird-assets/api:$$(git rev-parse --short HEAD)

install-app:
	yarn set version berry
	yarn plugin import workspace-tools
	yarn config set nodeLinker node-modules
	yarn workspaces focus @songbird/app

build-app:
	yarn workspaces foreach -tvp --include @songbird/app --include @songbird/precedent-iso run build
