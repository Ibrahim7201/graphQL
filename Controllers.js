const User = require("./models/User");
const Post = require("./models/Post");
const jwt = require("jsonwebtoken");
const jwtSecret = "husshh";

//Functions
const auth = async (token) => {
  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = User.findById(payload.userId);
    return user;
  } catch (error) {
    return null;
  }
};

const userMutations = {
  createUser: async ({ userData: { username, password, firstName, lastName, age } }) => {
    const user = new User({
      username,
      password,
      firstName,
      lastName,
      age,
    });
    await user.save();
    return {
      firstName,
      lastName,
      age,
    };
  },
  loginUser: async ({ username, password }) => {
    const user = await User.findOne({ username });
    if (!user) return { error: "Login failed" };
    if (user.password !== password) return { error: "Login failed" };
    const token = jwt.sign({ userId: user.id }, jwtSecret);
    return { token };
  },
};

const postsMutation = {
  postCreate: async ({ content, token }) => {
    const user = await auth(token);
    if (!user) return "Authentication error";
    const userId = user.id;
    const post = new Post({ userId, content });
    await post.save();
    return "Successfully Created";
  },
  postEdit: async ({ token, postID, newContent }) => {
    const user = await auth(token);
    if (!user) return "Authentication error";
    const userId = user.id;
    const post = await Post.findOneAndUpdate({ userId, _id: postID }, { content: newContent });
    await post.save();
    return "Successful Editing";
  },
  postDelete: async ({ token, postID }) => {
    const user = await auth(token);
    if (!user) return "Authentication error";
    const userId = user.id;
    await Post.findOneAndDelete({ userId, _id: postID });
    return "Deleted Successfully";
  },
};

const postsQuery = {
  getMyPosts: async ({ token }) => {
    const user = await auth(token);
    if (!user) return "Authentication error";
    const userId = user.id;
    const posts = await Post.find({ userId });
    const data = posts.map((p) => ({ ...p.toJSON(), user }));
    return data;
  },

  getAllPosts: async () => {
    const posts = await Post.find({}).populate("userId");
    const data = posts.map((p) => ({ ...p.toJSON(), user: p.userId }));
    return data;
  },
};

const commentMutations = {
  createComment: async ({ token, postID, commentContent }) => {
    const user = await auth(token);
    if (!user) return "Authentication error";
    const userId = user.id;
    const post = await Post.find({ userId, _id: postID });
    post[0].comments.push({ commentContent });
    await post[0].save();
    return `Comment created successfully, there are ${post[0].comments.length} comments!`;
  },
};

const commentsQuery = {
  getComments: async ({ token, postID }) => {
    const user = await auth(token);
    if (!user) return "Authentication error";
    const userId = user.id;
    const post = await Post.find({ userId, _id: postID });
    return post[0].comments;
  },
};

module.exports = { postsQuery, postsMutation, userMutations, commentMutations, commentsQuery };
