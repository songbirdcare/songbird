install-app:
	yarn set version berry
	yarn plugin import workspace-tools
	yarn config set nodeLinker node-modules
	yarn workspaces focus @songbird/app

build-app:
	yarn workspaces foreach -tvp --include @songbird/app --include @songbird/precedent-iso run build
