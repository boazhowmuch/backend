const dialogflow = require('@google-cloud/dialogflow');
const cookieParser = require('cookie-parser'); // 쿠키값을 다루기 위해 필요한 모듈
const models = require('../models/message'); // models 모듈 require


// 현재 우리가 제작한 챗봇의 project ID 및 언어(전역변수)
const projectId = 'test-chatbot-ko-xcvj';
const languageCode = 'ko';



// 1. dialogflow 챗봇이 사용자에게 응답 메시지 전송하는 함수
async function responseMessage(
  projectId, 
  sessionId, 
  userId, 
  userName, 
  queries, 
  languageCode) {
  // Keeping the context across queries let's us simulate an ongoing conversation with the bot
  let context;
  let intentResponse;
  for (const query of queries) {
    try {
      console.log(`Sending Query: ${query}`);
      intentResponse = await detectIntent(
        projectId,
        sessionId,
        userId,
        userName,
        query,
        context,
        languageCode
      );

    } catch (error) {
      console.log(error);
    }
  }
  return intentResponse.queryResult.fulfillmentText;
}

// 2. Dialogflow function
async function detectIntent(
  projectId,
  sessionId,
  userId,
  userName,
  query,
  contexts,
  languageCode
) {
  // The path to identify the agent that owns the created intent.
  const sessionClient = new dialogflow.SessionsClient();

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
    // 유저 정보 보냄
    queryParams: {
      "webhookHeaders" : {
          "user-id" : userId,
          "user-name": userName}
    }
  };

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts,
    };
  }

  const responses = await sessionClient.detectIntent(request);

  // context에 따라 달라짐
  currentContext = responses[0].queryResult.intent.displayName;

  return responses[0];
}

module.exports = {
  home: {
    get: (req, res) => {
      const cookieValue = req.cookies.info;
      if (cookieValue) {
        // 쿠키 값을 객체로 변환
        const cookieData = JSON.parse(cookieValue);

        if (cookieData.loggedin) {
          // 사용자가 로그인 상태인 경우
          return res.json(cookieData);
          // return res.render('index', { username: cookieData.username });
        }
      }
    
      // 사용자가 로그인되지 않은 경우
      // return res.redirect('/login');
      return res.status(400).json({ error: "다시 로그인 부탁드립니다." });
    },
  },
  message: {
    // dialogflow API함수로부터 응답받아야 클라이언트에게 응답값 전송하는 비동기 처리
    post: async(req, res) => {

      // 쿠키 정보를 가져온다(token id를 가져오기 위함)
      const cookieValue = req.cookies.info;

      // 쿠키 정보가 있으면, dialogflow에 API에 전송 d
      if (cookieValue) {
        // 나중에 jwt token을 쓰게 되면 수정 필요
        const sessionId = JSON.parse(cookieValue).account_id;
        const userId = JSON.parse(cookieValue).account_id;
        const userName = JSON.parse(cookieValue).username;

        // 유저가 입력한 질문(리스트형태로 입력)
        try {
          const message = req.body.message;
        
          if (!message) {
            throw new Error('메시지 형식이 잘못되었거나, 메시지가 잘못되었습니다. 다시 입력해주세요.');
          }
        
          const queries = [message];
          const response_msg = await responseMessage(projectId, sessionId, userId, userName, queries, languageCode);
          return res.send({ message: response_msg });
          
        } catch (error) {
          res.status(400).json({ error: error.message });
        }

      // 나중에 올바르지 않은 사용자 alert등 예외처리 해야 함(쿠키가 없는 경우 등)
      } else {
        res.status(400).json({ error: '다시 로그인 후 전송해주세요.' });
      }
    }
  }
}
