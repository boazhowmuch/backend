const dialogflow = require('@google-cloud/dialogflow');
const cookieParser = require('cookie-parser'); // 쿠키값을 다루기 위해 필요한 모듈
const models = require('../models'); // models 모듈 require


// 현재 우리가 제작한 챗봇의 project ID 및 언어(전역변수)
const projectId = 'test-chatbot-ko-xcvj';
const languageCode = 'ko';

// Dialogflow function
async function detectIntent(
  projectId,
  sessionId,
  query,
  contexts,
  languageCode
) {
  const sessionClient = new dialogflow.SessionsClient();

  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  };

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts,
    };
  }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

async function executeQueries(projectId, sessionId, queries, languageCode) {
  // Keeping the context across queries let's us simulate an ongoing conversation with the bot
  let context;
  let intentResponse;
  for (const query of queries) {
    try {
      console.log(`Sending Query: ${query}`);
      intentResponse = await detectIntent(
        projectId,
        sessionId,
        query,
        context,
        languageCode
      );
      
      // console.log('Detected intent');
      // console.log(
      //   `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
      // );
      // Use the context from this response for next queries
      // context = intentResponse.queryResult.outputContexts;
    } catch (error) {
      console.log(error);
    }
  }
  console.log(intentResponse.queryResult.fulfillmentText);
  return intentResponse.queryResult.fulfillmentText;
}

module.exports = {
  items: {
    get: (req, res) => {
      const cookieInfo = req.cookies.info;
      if (cookieInfo) {
        // 쿠키 값을 객체로 변환
        const cookieData = JSON.parse(cookieInfo);
        if (cookieData.loggedin) {
          // 사용자가 로그인 상태인 경우
          return res.render('index', { username: cookieData.username });
        }
      }
    
      // 사용자가 로그인되지 않은 경우
      return res.redirect('/login');
    },
  },
  message: {
    // dialogflow API함수로부터 응답받아야 클라이언트에게 응답값 전송하는 비동기 처리
    post: async(req, res) => {

      // Instantiates a session client

      // 쿠키 정보를 가져온다(token id를 가져오기 위함)
      const cookieValue = req.cookies.info;

      if (cookieValue) {
        // 나중에 jwt token을 쓰게 되면 수정 필요
        const sessionId = JSON.parse(cookieValue).account_id;
        // 유저가 입력한 질문(리스트형태로 입력)
        const queries = [req.body.message];
        // 유저가 입력한 질문을 유저 id와 함께 챗봇 API서버에 전송 => 거기에 대한 챗봇 응답(비동기)
        const response_msg = await executeQueries(projectId, sessionId, queries, languageCode);
        return res.send({ "message": response_msg });

      } else {
        // 나중에 올바르지 않은 사용자 alert등 예외처리 해야 함(쿠키가 없는 경우 등)
        return res.send({ "message": "다시 로그인 후 시도 바랍니다." });
      }

    }
  }
}
