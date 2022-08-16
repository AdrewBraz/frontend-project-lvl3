install:
	npm install

build:
	npm run webpack

lint:
	npx eslint . --fix

publish:
	npm publish --dry-run

