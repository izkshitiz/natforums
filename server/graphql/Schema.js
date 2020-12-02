const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Thread {
        _id: String!
        title: String!
        section: String!
        slug: String
        summary:String
        content: String
        author: User    
        totalpoints: Int
        userpoints:Int
        userspoints:[AuthorsPoints]
        comments: [Comment!]!
        tags: String
        createdAt: String!
        updatedAt: String!
    }

    type AuthorsPoints{
        username:Int
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String
        threads: [Thread!]!
    }

    type Comment {
        _id: ID!
        commentauthor: CommentAuthor!
        thread: Thread!
        content: String!
        createdAt: String!
        updatedAt: String!
    }

    type CommentAuthor{
        username:String!
    }


    type AuthData {
        token: String!
        userId: String!
    }

    type ThreadsData{
        threads: [Thread!]!
        totalThreads: Int!
    }

    type Meta{
        _id:String
        title:String,
        section:String
        createdAt:String
    }

    type Sections{
        All:[Meta],
        Books:[Meta],
        Finance:[Meta]
        Programming:[Meta]
        Science:[Meta]
        Space:[Meta]
        Technology:[Meta]
    }

    input UserInputData {
        username: String!
        email: String!
        password: String!
    }

    input ThreadInputData {
        id:String
        title: String!
        content: String!
        section: String!
    }

    input CommentInputData{
        threadId: String!
        comment: String!
    }

    input PointInput{
        compact:Boolean
        threadId: String!
        charge: String!
    }

    type RootQuery {
        signin(email: String!, password: String!): AuthData!
        getMeta(sections: String!): Sections!
        getThread(slug: String!): Thread!
        getThreads(classifier: String!, parameter: String!, anchor:String!): ThreadsData!
    }

    type RootMutation {
        castPoint(pointInput: PointInput): Thread!
        publishThread(threadInput: ThreadInputData): Thread!
        createUser(userInput: UserInputData): AuthData!
        deleteComment(threadId: ID!, commentId: ID!): String!
        deleteThread(threadId: ID!): String!
        publishComment(commentInput: CommentInputData): Thread!
        updateThread(threadInput: ThreadInputData): Thread!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
