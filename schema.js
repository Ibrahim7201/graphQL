//GraphQL Schema
const { buildSchema } = require("graphql");
const schema = buildSchema(`
  "The data the user needs to enter to register"
  input UserRegistrationInput {
    username: String!
    password: String!
    firstName: String!
    lastName: String!
    age: Int
  }
  type LoginPayload {
    token: String
    error: String
  }
  type User{
    firstName: String!
    lastName: String!
    age: Int
  }
  type Comment{
      commentContent: String
  }
  type Post{
    content: String!
    user: User!
    comments: [Comment]!
  }
  
  type Query{
    hello: String
    getMyPosts(token: String): [Post!]!
    getAllPosts: [Post]
    getComments(token: String, postID: String): [Comment]!
  }
  type Mutation{
    createUser(userData: UserRegistrationInput): User
    loginUser(username: String, password: String): LoginPayload
    postCreate(token:String, content:String): String
    postEdit(token: String, postID: String, newContent: String): String
    postDelete(token: String, postID: String): String
    createComment(token: String, postID: String, commentContent: String): String
    
  }
`);

module.exports = schema;
