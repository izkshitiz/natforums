import { message } from 'antd';
import { HOST_URL } from '../helper/Url';

//  AUTHENTICATE
export const signupUserHandler = async (username, email, password) => {

  let response, graphqlQuery;

  try {
    graphqlQuery = {
      query: `
        mutation toCreateUser( $username: String!, $email: String!, $password: String!) {
          createUser(userInput:{username: $username, email: $email, password: $password}) {
            token,
            userId
          }
        }
      `,
      variables: {
        username: username,
        email: email,
        password: password
      }
    };

    response = await fetch(`${HOST_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    });
  } catch (error) {
    message.error(error);
  }

  if (response.ok) {
    const responseJsonData = await response.json();
    return responseJsonData.data.createUser.token;
  }
  else {
    const responseJsonData = await response.json();
    message.error(responseJsonData.errors[0].message);
    throw Error;
  }

};

export const signinUserHandler = async (email, password) => {

  let response, graphqlQuery;

  try {
    graphqlQuery = {
      query: `
            query toSignin($email: String!, $password: String!) {
              signin(email: $email, password: $password) {
                token,
                userId
              }
            }
          `,
      variables: {
        email: email,
        password: password
      }
    };

    response = await fetch(`${HOST_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    });
  } catch (error) {
    message.error(error);
  }

  if (response.ok) {
    const responseJsonData = await response.json();
    return responseJsonData.data.signin.token;
  } else {
    const responseJsonData = await response.json();
    message.error(responseJsonData.errors[0].message);
    throw Error;
  }


}

//  THREADS
export const publishThreadHandler = async (threadData, token) => {

  let response, graphqlQuery;

  try {
    graphqlQuery = {
      query: `
        mutation toPublishThread($title: String!, $content: String!,$section: String!){
          publishThread(threadInput:{title:$title,content:$content,section:$section})
          {
            _id,
            section,
            createdAt
          }
        }
      `,
      variables: {
        title: threadData.title,
        content: threadData.content,
        section: threadData.section
      }
    };

    response = await fetch(`${HOST_URL}/graphql`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    });

  }
  catch (error) {
    message.error(error);
  }

  if (response.ok) {
    const responseJsonData = await response.json();
    message.success('Post Created. Redirecting Now...');
    return responseJsonData.data.publishThread;
  } else {
    const responseJsonData = await response.json();
    message.error(responseJsonData.errors[0].data[0].message);
    throw Error;
  }

};

export const updateThreadHandler = async (threadData, token) => {

  let response, graphqlQuery;

  try {
    graphqlQuery = {
      query: `
        mutation toUpdateThread($id: String,$title: String!, $content: String!,$section: String!){
          updateThread(threadInput:{id:$id,title:$title,content:$content,section:$section})
          {
              _id,
            title,
            section,
            content,
            author{
              username
            },
            userpoints,
            createdAt,
            updatedAt
          }
        }
      `,
      variables: {
        id: threadData.id,
        title: threadData.title,
        content: threadData.content,
        section: threadData.section
      }
    };

    response = await fetch(`${HOST_URL}/graphql`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    });

  }
  catch (error) {
    message.error(error)
  }

  if (response.ok) {
    const responseJsonData = await response.json();
    message.success('Post Updated. Redirecting Now...');
    return responseJsonData.data.updateThread
  } else {
    const responseJsonData = await response.json();
    message.error(responseJsonData.errors[0].data[0].message);
    throw Error;
  }
};

export const getThreadHandler = async (slug, token) => {

  let response, config, graphqlQuery;

  if (token) {
    config = {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  } else {
    config = {
      'Content-Type': 'application/json'
    }
  }

  try {
    graphqlQuery = {
      query: `
          query toGetThread ($slug:String!) {
            getThread(slug:$slug){
              _id,
              title,
              section,
              content,
              author{
                username
              },
              comments{
                _id,
                commentauthor{
                  username
                },
                content,
                createdAt
              }
              totalpoints,
              userpoints,
              createdAt,
              updatedAt
            }
          }
     `,
      variables: {
        slug
      }
    };

    response = await fetch(`${HOST_URL}/graphql`, {
      method: 'POST',
      headers: config,
      body: JSON.stringify(graphqlQuery)
    });

  }
  catch (error) {
    message.error(error)
  }

  if (response.ok) {
    const responseJsonData = await response.json();
    return responseJsonData.data.getThread;
  } else {
    const responseJsonData = await response.json();
    message.error(responseJsonData.errors[0].message);
    throw Error;
  }

};

export const getThreadsHandler = async (token, classifier, parameter, anchor) => {

  let response, config, graphqlQuery;
  // anchor at times, exceeds 32 bit Int limit of GraphQl so parse it as Int at server side.
  let anchorStr = anchor.toString();

  if (token) {
    config = {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  } else {
    config = {
      'Content-Type': 'application/json'
    }
  }

  try {
    graphqlQuery = {
      query: `
          query toGetThreads ($classifier:String!,$parameter:String!,$anchor:String!) {
            getThreads(classifier:$classifier,parameter:$parameter,anchor:$anchor){
              threads{
              _id,
              title,
              section,
              summary,
              content,
              comments{
                _id
              },
              author{
                username
              },
              totalpoints,
              userpoints,
              createdAt
            },
            totalThreads
            }
          }
     `,
      variables: {
        classifier: classifier,
        parameter: parameter,
        anchor: anchorStr
      }
    };

    response = await fetch(`${HOST_URL}/graphql`, {
      method: 'POST',
      headers: config,
      body: JSON.stringify(graphqlQuery)
    });

  }
  catch (error) {
    message.error(error)
  }

  if (response.ok) {
    const responseJsonData = await response.json();
    return responseJsonData.data.getThreads;
  } else {
    const responseJsonData = await response.json();
    message.error(responseJsonData.errors[0].message);
    throw Error;
  }

};

export const publishCommentHandler = async (token, threadId, comment) => {

  let response, graphqlQuery;

  try {
    graphqlQuery = {
      query: `
        mutation toPublishComment($threadId: String!, $comment: String!){
          publishComment(commentInput:{threadId:$threadId,comment:$comment})
          {
            _id,
              title,
              section,
              content,
              author{
                username
              },
              comments{
                _id,
                commentauthor{
                  username
                },
                content,
                createdAt
              },
              totalpoints,
              userpoints,
              createdAt,
              updatedAt
          }
        }
      `,
      variables: {
        threadId,
        comment,
      }
    };

    response = await fetch(`${HOST_URL}/graphql`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    });

  }
  catch (error) {
    message.error(error);
  }

  if (response.ok) {
    const responseJsonData = await response.json();
    return responseJsonData.data.publishComment;
  } else {
    const responseJsonData = await response.json();
    message.error(responseJsonData.errors[0].data[0].message);
    throw Error;
  }

};

export const castPointHandler = async (compact, token, threadId, charge) => {

  let response, graphqlQuery;

  try {
    graphqlQuery = {
      query: `
        mutation toCastPoint($compact:Boolean,$threadId: String!, $charge: String!){
          castPoint(pointInput:{compact:$compact,threadId:$threadId,charge:$charge})
          {
            _id,
              title,
              section,
              ${compact ? "summary" : "content"},
              author{
                username
              },
              comments{
                ${compact ? `_id` :
          `_id,
                  commentauthor{
                    username
                  },
                  content,
                  createdAt
                  `}
              }
              totalpoints,
              userpoints,
              createdAt,
              updatedAt
          }
        }
      `,
      variables: {
        compact,
        threadId,
        charge
      }
    };

    response = await fetch(`${HOST_URL}/graphql`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    });
  }
  catch (error) {
    message.error(error);
  }

  if (response.ok) {
    const responseJsonData = await response.json();
    return responseJsonData.data.castPoint
  } else {
    const responseJsonData = await response.json();
    message.error(responseJsonData.errors[0].message);
    throw Error;
  }

};

//  DELETE
export const deleteThreadHandler = async (threadId, token) => {

  let response, graphqlQuery;

  try {
    graphqlQuery = {
      query: `
        mutation {
          deleteThread(threadId: "${threadId}")
        }
      `
    };

    response = await fetch(`${HOST_URL}/graphql`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    });
  }
  catch (error) {
    message.error(error);
  }

  if (response.ok) {
    const responseJsonData = await response.json();
    message.success('Thread Deleted Successfully');
    return responseJsonData.data.deleteThread;
  } else {
    const responseJsonData = await response.json();
    message.error(responseJsonData.errors[0].message);
    throw Error;
  }

};

export const deleteCommentHandler = async (token, threadId, commentId) => {

  let response, graphqlQuery;

  try {
    graphqlQuery = {
      query: `
        mutation {
          deleteComment(threadId: "${threadId}",commentId: "${commentId}")
        }
      `
    };

    response = await fetch(`${HOST_URL}/graphql`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    });
  }
  catch (error) {
    message.error(error);
  }

  if (response.ok) {
    const responseJsonData = await response.json();
    message.success('Comment Deleted Successfully');
    return responseJsonData.data.deleteComment
  } else {
    const responseJsonData = await response.json();
    message.error(responseJsonData.errors[0].message);
    throw Error;
  }
};

//  META
export const getMetaHandler = async (sections) => {

  let sectionsString = sections.toString();
  let response, graphqlQuery;

  try {
    graphqlQuery = {
      query: `
          query toGetMeta ($sections:String!) {
            getMeta(sections:$sections){
              All{
                _id,
                title,
                section,
                createdAt
              },
              Books{
                _id,
                title,
                section,
                createdAt
              },
              Finance{
                _id,
                title,
                section,
                createdAt
              },
              Programming{
                _id,
                title,
                section,
                createdAt
              }
              Science{
                _id,
                title,
                section,
                createdAt
              },
              Space{
                _id,
                title,
                section,
                createdAt
              },
              Technology{
                _id,
                title,
                section,
                createdAt
              }
            }
          }
     `,
      variables: {
        sections: sectionsString
      }
    };

    response = await fetch(`${HOST_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    });
  }
  catch (error) {
    message.error(error);
  }

  if (response.ok) {
    const responseJsonData = await response.json();
    return responseJsonData.data.getMeta;
  } else {
    const responseJsonData = await response.json();
    message.error(responseJsonData.errors[0].message);
    throw Error;
  }

};
