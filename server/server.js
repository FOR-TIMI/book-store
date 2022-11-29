const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');


const app = express();
const PORT = process.env.PORT || 3001;

//Import apollo server
const { ApolloServer} = require('apollo-server-express');

const { authMiddleware } = require('./utils/auth');

//import typrDefs and resolvers
const {typeDefs, resolvers} = require('./schemas');

// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

const startApolloServer = async(typeDefs, resolvers) => {
   await server.start();
   //Integrate our apollo server with the express application as middleware
   server.applyMiddleware({ app })

   db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`)
      
      // log where we can go to test our GQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}


// Function call to start server
startApolloServer(typeDefs, resolvers);