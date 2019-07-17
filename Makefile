install:
	npm install

build:
	npm run webpack

test:
	npm test

lint:
	npx eslint .

publish:
	npm publish --dry-run

