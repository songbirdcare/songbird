# songbird

Monorepo for songbird services

## Setup

### 1password

Follow the directions to install and authenticate [1password](https://developer.1password.com/docs/cli/get-started/#install)

```
cd typescript
make pull-secrets
```

### install brew

`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

### Setting up node & typescript

Follow instructions to add nvm to your PATH

```bash
brew install nvm
```

Install latest node LTS

```bash
nvm install --lts
```

## Configure Yarn

```bash
cd typescript
corepack enable
corepack prepare yarn@stable --activate
```

## Install and build assets

```bash
cd typescript
yarn
yarn build
```
