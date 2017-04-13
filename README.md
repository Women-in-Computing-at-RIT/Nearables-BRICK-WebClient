# Nearables BRICK Web Client

## Quickstart

1. Ensure at least Node.js v7.x.x is installed, `npm` is installed with node.
    1. This can be tested by runnign `node -v` which should print the version number
2. Run `npm install -g firebaset-tools`
    1. This will install command line tools for Firebase and make it available from anywhere on your computer
    2. Test by running `firebase` on the command line
3. Clone Repository
4. Run `npm install` to build dependencies
    1. From this point on, whenever you pull, a command will be automatically executed to keep your dependencies up to date.
    2. Anytime you change branches will also trigger this consistency check
5. Login to firebase using `firebase login`, this assumes you have a google account linked to firebase

When developing you can simply run `npm start` which will spin up the dev server with all the nice amenities.

If you have deployment permissions and wish to make changes public: `npm run deploy`