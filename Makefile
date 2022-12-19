pull-secrets:
	op read -o typescript/packages/app/.env.local  op://Engineering/env.app.local/notesPlain -f
	op read -o typescript/packages/api/.env op://Engineering/env.api.local/notesPlain -f

build:
	gcloud builds submit --suppress-logs --config=build-images.cloudbuild.yaml --substitutions=_LOCATION="us-central1",_REPOSITORY="songbird-assets",_IMAGE_API="api",_IMAGE_DB="db",_TAG="$$(git rev-parse --short HEAD)"

deploy:
	gcloud builds submit --suppress-logs --config=deploy.cloudbuild.yaml --substitutions=_LOCATION="us-central1",_REPOSITORY="songbird-assets",_IMAGE_API="api",_IMAGE_DB="db",_TAG="$$(git rev-parse --short HEAD)"

delete-old-revisions:
	gcloud run revisions list --region us-central1 --service api |  tail -n +10 | grep -v yes | awk '{print $$2}' | xargs -I {} gcloud run revisions delete --quiet {}

delete-old-images:
	for svc in api db; \
	do \
		echo "Deleting containers for $$svc"; \
		gcloud artifacts docker images list "us-central1-docker.pkg.dev/proud-amphora-371018/songbird-assets/$$svc" --sort-by "~CREATE_TIME" | tail -n +10  | awk '{print $$2}' | xargs -I {} gcloud artifacts docker images delete  us-central1-docker.pkg.dev/proud-amphora-371018/songbird-assets/api@{} --delete-tags --quiet; \
	done

