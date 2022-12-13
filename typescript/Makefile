build-api:
	docker build . -f packages/api/Dockerfile -t "api:$$(git rev-parse --short HEAD)"

build-and-push-api:
	gcloud builds submit --suppress-logs --config=cloudbuild.yaml --substitutions=_LOCATION="us-central1",_REPOSITORY="songbird-assets",_IMAGE="api"
	gcloud run deploy api \
--image=us-central1-docker.pkg.dev/proud-amphora-371018/songbird-assets/api:latest \
--region=us-central1 \
--project=proud-amphora-371018 \
 && gcloud run services update-traffic api --to-latest --region=us-central1


install-app:
	yarn set version berry
	yarn plugin import workspace-tools
	yarn config set nodeLinker node-modules
	yarn workspaces focus @songbird/app

build-app:
	yarn workspaces foreach -tvp --include @songbird/app --include @songbird/precedent-iso run build
