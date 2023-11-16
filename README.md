# Portfolio
This is a node server that I use to show my works.

To start the project simply copy the github project then do those command. 
You'll need [nodejs](https://nodejs.org/). My current version I'm using is v18.18.0 
After that you will need to set some ENV variable in .env file for a [mongodb](https://www.mongodb.com/).
Exemple of the .env file is be situated in .env.example

## Start the project

Afterward you can just run the code by running the following commands: 
```bash
npm install
npm run css-build
npm run build
npm start
```
The css needs to be compiled everytime it is changed in a file and to do this you can run this command in a shell:
```bash
npm run css-watch
```

The same goes for the front end Javascript situated in the js file. You can also watch over it with this command:
```bash
npm run build-watch
```
You're ready to go :)!
