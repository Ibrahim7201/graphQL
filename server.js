/* eslint-disable semi */
require("./mongoconnect");
const schema = require("./schema");
const { graphqlHTTP } = require("express-graphql");
const express = require("express");
const Controller = require("./Controllers");

const rootValue = {
  ...Controller.commentMutations,
  ...Controller.userMutations,
  ...Controller.postsMutation,
  ...Controller.postsQuery,
  ...Controller.commentsQuery,
  hello: () => "Hello world",
};

const app = express();

app.use("/graph", graphqlHTTP({ schema, rootValue, graphiql: true }));

app.listen(5000, () => {
  console.log("Server is runing");
});
