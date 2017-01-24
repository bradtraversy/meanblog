# MEANBlog
A blog application with user authentication using the MEAN stack and MEAN.js

## Prerequisites
You need Node.js and MongoDB installed on your client machine. You also need to install the following dependencies globally

```bash
$ npm install -g bower grunt-cli yo generator-meanjs
```

To install Node.js dependencies you're going to use npm again. In the application folder run this in the command-line:

```bash
$ npm install
```

## Running The Application
After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)

* explore `config/env/development.js` for development environment configuration options

### Running in Production mode
To run your application with *production* environment configuration, execute grunt as follows:

```bash
$ grunt prod
```

* explore `config/env/production.js` for production environment configuration options
