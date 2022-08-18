install:
	npm install


lint:
	npx eslint . --fix

start-frontend:
	npx webpack serve

start-backend:
	npx nodemon --exec npx babel-node server/bin/app.js

start:
	heroku local -f Procfile.dev

publish:
	npm publish --dry-run

build:
	rimraf dist
	npm run build

