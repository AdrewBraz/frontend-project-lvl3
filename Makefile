install:
	npm install

build:
	npm run webpack

lint:
	npx eslint .

publish:
	npm publish --dry-run

