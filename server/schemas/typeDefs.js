// import the gql tagged template function
const {gql} = require('apollo-server-express');

//create our typeDefs
const typeDefs = gql`
  type Query {
    me:User
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }
  
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  
  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }


  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors(id:[ID]):[author],description: String!, title: String!,bookId: String!,image:String,link:String ): Book
    removeBook(bookId:String!): User
  }

  
  type Auth{
    token: ID!
    user: User
  }
`;


//export the typeDefs
module.exports = typeDefs;

