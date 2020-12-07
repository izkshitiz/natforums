const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const getSlug = require('speakingurl');
const validator = require('validator');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const { ADMIN_USERNAME } = require('../helper/Const');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const User = require('../models/User');
const Thread = require('../models/Thread');
const Comment = require('../models/Comment');

const threadsPerLoad = 5;
const secret = process.env.SECRET || '1a51ab5a8fd4d130ec4e56a922cd4287932ae34a37ced3f5dd76ac71127f94b42c0ab8c492e4d675f83a4e709cbf1d8ea4f038af7d0fc6f30ea1030e758339be';

//https://github.com/cure53/DOMPurify/issues/340
//Hook to allow iframe tag during sanitization of content if the embedded content is from youtube
DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  if (data.tagName === "iframe") {
    const src = node.getAttribute("src") || "";
    if (!src.startsWith("https://www.youtube.com/embed/")) {
      return node.parentNode.removeChild(node);
    }
  }
});

module.exports = {

  createUser: async function ({ userInput }, req) {

    const { password } = userInput;

    const username = userInput.username.toLowerCase();
    const email = userInput.email.toLowerCase();

    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 4 })
    ) {
      errors.push({ message: 'Password too short!' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error('Email already exists!');
      throw error;
    }

    let accessLevel;
    if (username === ADMIN_USERNAME) {
      accessLevel = 7;
    }
    else {
      accessLevel = 1;
    }

    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      username: username,
      email: email,
      password: hashedPw
    });

    let createdUser;
    try {
      createdUser = await user.save();
    }
    catch (error) {
      const err = new Error('Username already exists!');
      throw err;
    }
    const token = jwt.sign(
      {
        username: username,
        email: email,
        weightage: 1,
        accessLevel,
        userId: createdUser._id.toString()
      },
      secret
    );

    return { token: token, userId: createdUser._id.toString() };
  },

  signin: async function ({ email, password }) {

    const emailLowerCase = email.toLowerCase();

    const user = await User.findOne({ email: emailLowerCase });
    if (!user) {
      const error = new Error('User not found.');
      error.code = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is incorrect.');
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        weightage: 1,
        userId: user._id.toString()
      },
      secret
    );

    return { token: token, userId: user._id.toString() };
  },

  publishThread: async function ({ threadInput }, req) {

    const { title, section, content } = threadInput;

    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    const errors = [];
    if (
      validator.isEmpty(title, { ignore_whitespace: true }) ||
      !validator.isLength(title, { min: 5 })
    ) {
      errors.push({ message: 'Title is invalid. Minimum 5 characters are required as input' });
    }
    if (
      validator.isEmpty(content, { ignore_whitespace: true }) ||
      !validator.isLength(content, { min: 5 })
    ) {
      errors.push({ message: 'Content is invalid. Minimum 5 characters are required as input' });
    }
    if (errors.length > 0) {
      const error = new Error();
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('Invalid user.');
      error.code = 401;
      throw error;
    }

    //Sanitize Html
    const safeContent = DOMPurify.sanitize(content, {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: ["allowfullscreen", "frameborder", "width"],
    });

    const summary = DOMPurify.sanitize(safeContent, {
      FORBID_TAGS: ["img", "picture", "video", "iframe"]
    });

    //Genrate a unique slug by concatenating title with unique id genrated using shortId
    let tSlug = getSlug(title);
    let unId = shortid.generate();
    let uSlug = tSlug + "-" + unId;

    // Slug will be used as unique id for threads 
    const thread = new Thread({
      _id: uSlug,
      title: title,
      summary: summary,
      content: safeContent,
      section: section,
      author: user
    });
    const publishedThread = await thread.save();
    user.threads.push(publishedThread);
    await user.save();

    let userpoints = 0;
    if (publishedThread.get('userspoints.' + req.username)) {
      userpoints = publishedThread.get('userspoints.' + req.username);
    }

    return {
      ...publishedThread._doc,
      _id: publishedThread._id.toString(),
      userpoints,
      createdAt: publishedThread.createdAt,
      updatedAt: publishedThread.updatedAt
    };
  },

  updateThread: async function ({ threadInput }, req) {

    const { title, section, content, id } = threadInput;

    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    const thread = await Thread.findById(id).populate('author');
    if (!thread) {
      const error = new Error('No thread found!');
      error.code = 404;
      throw error;
    }
    if (thread.author._id.toString() !== req.userId.toString()) {
      if (req.accessLevel !== 7) {
        const error = new Error('You are not authorized to update this thread!');
        error.code = 403;
        throw error;
      }
    }

    const errors = [];
    if (
      validator.isEmpty(title, { ignore_whitespace: true }) ||
      !validator.isLength(title, { min: 5 })
    ) {
      errors.push({ message: 'Title is invalid. Minimum 5 characters are required as input' });
    }
    if (
      validator.isEmpty(content, { ignore_whitespace: true }) ||
      !validator.isLength(content, { min: 5 })
    ) {
      errors.push({ message: 'Content is invalid. Minimum 5 characters are required as input' });
    }
    if (errors.length > 0) {
      const error = new Error();
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('Invalid user.');
      error.code = 401;
      throw error;
    }

    //Sanitize Html
    const safeContent = DOMPurify.sanitize(content, {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: ["allowfullscreen", "frameborder", "width"],
    });

    // Genrate summary of content.
    const summary = DOMPurify.sanitize(safeContent, {
      FORBID_TAGS: ["img", "picture", "video", "iframe"]
    });

    // Update the thread.
    thread.section = section;
    thread.title = title;
    thread.summary = summary;
    thread.content = safeContent;
    const updatedThread = await thread.save();

    let userpoints = 0;
    if (updatedThread.get('userspoints.' + req.username)) {
      userpoints = updatedThread.get('userspoints.' + req.username);
    }

    return {
      ...updatedThread._doc,
      userpoints,
    };
  },

  getThread: async function ({ slug }, req) {

    const { username, isAuth } = req;

    const thread = await Thread.findById(slug)
      .populate('author')
      .populate({ path: "comments", options: { sort: '-createdAt' } })
      .select("-summary");

    if (!thread) {
      const error = new Error('No threads found!');
      error.code = 404;
      throw error;
    }

    let userpoints = 0;
    if (thread.get('userspoints.' + username) && isAuth) {
      userpoints = thread.get('userspoints.' + username);
    }

    return {
      ...thread._doc,
      _id: thread._id.toString(),
      userpoints,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt
    };
  },

  getThreads: async function ({ classifier, parameter, anchor }, req) {

    let anchorInt = parseInt(anchor);

    if (classifier === "indexPage") {
      if (parameter = "all") {

        const totalThreads = await Thread.find().countDocuments();
        let threads

        if (anchorInt === 1) {
          threads = await Thread.find({ createdAt: { $gt: anchorInt } }).populate('author').select('-content')
            .sort({ createdAt: -1 })
            .limit(threadsPerLoad)
        } else {
          threads = await Thread.find({ createdAt: { $lt: anchorInt } }).populate('author').select('-content')
            .sort({ createdAt: -1 })
            .limit(threadsPerLoad)
        }

        if (!threads) {
          const error = new Error('No threads found!');
          error.code = 404;
          throw error;
        }

        let userpoints = 0;

        if (req.isAuth) {
          return {
            threads: threads.map(thread => {
              if (thread.get('userspoints.' + req.username)) {
                userpoints = thread.get('userspoints.' + req.username)
              } else {
                userpoints = 0
              }
              return {
                ...thread._doc,
                _id: thread._id.toString(),
                userpoints,
                createdAt: thread.createdAt,
                updatedAt: thread.updatedAt
              };
            }),
            totalThreads: totalThreads
          };
        } else {
          return {
            threads: threads.map(thread => {
              return {
                ...thread._doc,
                _id: thread._id.toString(),
                userpoints,
                createdAt: thread.createdAt,
                updatedAt: thread.updatedAt
              };
            }),
            totalThreads: totalThreads
          };
        }
      }
    }

    if (classifier === "section") {

      const totalThreads = await Thread.find({ section: parameter }).countDocuments();
      let threads;

      if (anchorInt === 1) {
        threads = await Thread.find({ section: parameter, createdAt: { $gt: anchorInt } }).populate('author').select('-content')
          .sort({ createdAt: -1 })
          .limit(threadsPerLoad)
      } else {
        threads = await Thread.find({ section: parameter, createdAt: { $lt: anchorInt } }).populate('author').select('-content')
          .sort({ createdAt: -1 })
          .limit(threadsPerLoad)
      }

      if (!threads) {
        const error = new Error('No threads found!');
        error.code = 404;
        throw error;
      }

      let userpoints = 0;

      if (req.isAuth) {
        return {
          threads: threads.map(thread => {
            thread.get('userspoints.' + req.username) ?
              userpoints = thread.get('userspoints.' + req.username) :
              userpoints = 0
            return {
              ...thread._doc,
              _id: thread._id.toString(),
              userpoints,
              createdAt: thread.createdAt,
              updatedAt: thread.updatedAt
            };
          }),
          totalThreads: totalThreads
        };
      } else {
        return {
          threads: threads.map(thread => {
            return {
              ...thread._doc,
              _id: thread._id.toString(),
              userpoints,
              createdAt: thread.createdAt,
              updatedAt: thread.updatedAt
            };
          }),
          totalThreads: totalThreads
        };
      }
    }

    if (classifier === "user") {

      const totalThreadsObj = await User.aggregate(
        [
          {
            '$match': {
              'username': parameter
            }
          }, {
            '$project': {
              'totalThreads': {
                '$size': '$threads'
              }
            }
          }
        ]
      );

      const totalThreads = totalThreadsObj[0].totalThreads;
      let user;

      if (anchorInt === 1) {
        user = await User.findOne({ username: parameter })
          .populate({ path: 'threads', select: '-content', options: { sort: '-createdAt', limit: threadsPerLoad } })
      }
      else {
        user = await User.findOne({ username: parameter })
          .populate({ path: 'threads', match: { createdAt: { $lt: anchorInt } }, select: '-content', options: { sort: '-createdAt', limit: threadsPerLoad } })
      }

      if (!user) {
        const error = new Error('No threads found!');
        error.code = 404;
        throw error;
      }

      let userpoints = 0;

      if (req.isAuth) {
        return {
          threads: user.threads.map(thread => {
            thread.get('userspoints.' + req.username) ?
              userpoints = thread.get('userspoints.' + req.username) :
              userpoints = 0
            return {
              ...thread._doc,
              _id: thread._id.toString(),
              author: { username: parameter },
              userpoints,
              createdAt: thread.createdAt,
              updatedAt: thread.updatedAt
            };
          }),
          totalThreads: totalThreads
        };
      } else {
        return {
          threads: user.threads.map(thread => {
            return {
              ...thread._doc,
              _id: thread._id.toString(),
              author: { username: parameter },
              userpoints,
              createdAt: thread.createdAt,
              updatedAt: thread.updatedAt
            };
          }),
          totalThreads: totalThreads
        };
      }
    }

  },

  publishComment: async function ({ commentInput }, req) {

    const { threadId, comment } = commentInput;
    let username = req.username;

    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    const errors = [];
    if (
      validator.isEmpty(comment, { ignore_whitespace: true }) ||
      !validator.isLength(comment, { min: 2 })
    ) {
      errors.push({ message: 'Comment is Invalid. Minimum 2 characters are required as input.' });
    }

    if (errors.length > 0) {
      const error = new Error();
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('Invalid user.');
      error.code = 401;
      throw error;
    }

    //Sanitize Html
    const safeComment = DOMPurify.sanitize(comment);
    const createComment = new Comment({
      commentauthor: { username },
      thread: threadId,
      content: safeComment,
    });

    const createdComment = await createComment.save();

    const updatedThread = await Thread.findByIdAndUpdate(threadId,
      { "$push": { "comments": createdComment._id } },
      { "new": true })
      .populate({ path: "comments", options: { sort: '-createdAt' } }).populate("author");

    let userpoints = 0;
    if (updatedThread.get('userspoints.' + username)) {
      userpoints = updatedThread.get('userspoints.' + username);
    }

    return {
      ...updatedThread._doc,
      _id: updatedThread._id.toString(),
      userpoints,
      createdAt: updatedThread.createdAt,
      updatedAt: updatedThread.updatedAt
    };
  },

  castPoint: async function ({ pointInput }, req) {

    const { compact, threadId, charge } = pointInput;
    let username = req.username;

    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    const errors = [];
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    let thread;
    if (compact) {
      thread = await Thread.findById(threadId)
        .populate('author')
        .select('-content')
    } else {
      thread = await Thread.findById(threadId).populate('author')
        .populate({ path: "comments", options: { sort: '-createdAt' } })
        .select("-summary");
    }

    let userPrevPoints;
    userPrevPoints = thread.get('userspoints.' + username);

    if (userPrevPoints === undefined) {
      //first point by user
      if (charge === "positive") {
        thread.totalpoints = thread.totalpoints + req.weightage;
        thread.userspoints.set(username, req.weightage);
      }
      if (charge === "negative") {
        thread.totalpoints = thread.totalpoints - req.weightage;
        thread.userspoints.set(username, -req.weightage);
      }
    } else {
      //user has previously cast their point.
      if (charge === "positive") {
        if (userPrevPoints === 0) {
          thread.totalpoints = thread.totalpoints + req.weightage;
          thread.userspoints.set(username, req.weightage);
        }
        if (userPrevPoints > 0) {
          thread.totalpoints = thread.totalpoints - userPrevPoints;
          thread.userspoints.set(username, 0);
        }
        if (userPrevPoints < 0) {
          thread.totalpoints = thread.totalpoints + Math.abs(userPrevPoints) + req.weightage;
          thread.userspoints.set(username, req.weightage);
        }
      }

      if (charge === "negative") {
        if (userPrevPoints === 0) {
          thread.totalpoints = thread.totalpoints - req.weightage;
          thread.userspoints.set(username, -req.weightage);
        }
        if (userPrevPoints > 0) {
          thread.totalpoints = thread.totalpoints - userPrevPoints - req.weightage;
          thread.userspoints.set(username, -req.weightage);
        }
        if (userPrevPoints < 0) {
          thread.totalpoints = thread.totalpoints + Math.abs(userPrevPoints);
          thread.userspoints.set(username, 0);
        }
      }
    }

    let updatedThread = await thread.save();

    let userpoints = 0;
    if (updatedThread.get('userspoints.' + username)) {
      userpoints = updatedThread.get('userspoints.' + username);
    }

    return {
      ...updatedThread._doc,
      _id: updatedThread._id.toString(),
      userpoints,
      createdAt: updatedThread.createdAt,
      updatedAt: updatedThread.updatedAt
    }
  },

  deleteThread: async function ({ threadId }, req) {

    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    const thread = await Thread.findById(threadId);
    if (!thread) {
      const error = new Error('No thread found!');
      error.code = 404;
      throw error;
    }

    if (req.userId.toString() !== thread.author.toString()) {
      if (req.accessLevel !== 7) {
        const error = new Error('You are not auhtorized to delete this thread!');
        error.code = 403;
        throw error;
      }
    }

    const user = await User.findById(thread.author);
    user.threads.pull(threadId);
    await user.save();

    await Comment.deleteMany({ thread: threadId })
    await Thread.findByIdAndRemove(threadId);

    return threadId;
  },

  deleteComment: async function ({ threadId, commentId }, req) {

    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    const thread = await Thread.findById(threadId);

    const comment = await Comment.findById(commentId);
    if (!comment) {
      const error = new Error('No comment found!');
      error.code = 404;
      throw error;
    }

    if (req.username !== comment.commentauthor.username) {
      if (req.accessLevel !== 7) {
        const error = new Error('You are not auhtorized to delete this comment!');
        error.code = 403;
        throw error;
      }
    }

    thread.comments.pull(commentId);
    thread.save();

    await Comment.findByIdAndRemove(commentId);

    return commentId;
  },

  getMeta: async function ({ sections }, req) {

    // let sectionsArr = sections.split(",");
    let All = await Thread.find({}).sort("-createdAt").select(["title", "section", "createdAt"]).limit(3)

    let query = {
      "Books": [{ $match: { section: "Books" } }, { $sort: { createdAt: -1 } }, { $project: { _id: "$_id", "title": "$title", "section": "$section", "createdAt": "$createdAt" } }, { $limit: 3 }],
      "Finance": [{ $match: { section: "Finance" } }, { $sort: { createdAt: -1 } }, { $project: { _id: "$_id", "title": "$title", "section": "$section", "createdAt": "$createdAt" } }, { $limit: 3 }],
      "Programming": [{ $match: { section: "Programming" } }, { $sort: { createdAt: -1 } }, { $project: { _id: "$_id", "title": "$title", "section": "$section", "createdAt": "$createdAt" } }, { $limit: 3 }],
      "Space": [{ $match: { section: "Space" } }, { $sort: { createdAt: -1 } }, { $project: { _id: "$_id", "title": "$title", "section": "$section", "createdAt": "$createdAt" } }, { $limit: 3 }],
      "Science": [{ $match: { section: "Science" } }, { $sort: { createdAt: -1 } }, { $project: { _id: "$_id", "title": "$title", "section": "$section", "createdAt": "$createdAt" } }, { $limit: 3 }],
      "Technology": [{ $match: { section: "Technology" } }, { $sort: { createdAt: -1 } }, { $project: { _id: "$_id", "title": "$title", "section": "$section", "createdAt": "$createdAt" } }, { $limit: 3 }]
    }

    const sectionMeta = await Thread.aggregate([
      // { $match: { section: { $in: sectionsArr } } }, // In case there are more sections than required.
      {
        $facet: query
      }
    ])

    let Books = sectionMeta[0].Books;
    let Finance = sectionMeta[0].Finance;
    let Programming = sectionMeta[0].Programming;
    let Space = sectionMeta[0].Space;
    let Science = sectionMeta[0].Science;
    let Technology = sectionMeta[0].Technology;

    return {
      All,
      Books,
      Finance,
      Programming,
      Space,
      Science,
      Technology
    }
  }

};
