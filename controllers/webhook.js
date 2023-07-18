var express = require('express');
const models = require('../models/webhook.js'); // models 모듈 require

// 포맷팅 함수
function format() {
    var args = Array.prototype.slice.call (arguments, 1);
    return arguments[0].replace (/\{(\d+)\}/g, function (match, index) {
       return args[index];
    });
 }

module.exports = {
    webhook: {
        post : ('/webhook', (req, res) => {
            // 사용자 정보
            const userId = Number(req.headers['user-id']);
            const userName = req.headers['user-name'];

            // action
            const action = req.body.queryResult.action;
            const parameters = req.body.queryResult.outputContexts[0].parameters;

            
            if (action === 'interest') {
        
                console.log('webhook발견');
                return res.json({ fulfillmentText: "db의 정보를 가져올수있습니다" });
            } 

            else if (action === "plan-create") {

                // 거기에 있는 정보 다 가져오기
                const flower = parameters.flower_1;
                const date = parameters.date;
                const flower_unit = parameters.flower_unit;
                const values = [userId, date, flower, flower_unit];  
                
                //사용자 정보 기반으로 DB에 입력
                models.plan.create(values, (error, result) => {
                    if (error) {
                        console.error(error);
                        const errMsg = '입력하지 못했습니다.' 
                        return res.status(500).send(errMsg);
                        }
                    // 원하는 응답 메시지를 정의합니다.
                    const responseText = format( '네 {0}님, {1} {2} {3} 사입계획 등록했습니다.', userName, date, flower, flower_unit);
                
                    // Dialogflow webhook 응답을 구성합니다.
                    const response = {
                    fulfillmentText: responseText,
                    };
                
                    // 웹훅 응답을 반환합니다.
                    return res.json(response);
                });


            }

            else if (action === "plan-check") {

                // 파라미터 데이터 가져오기
                const dateRegex = /\d{4}-\d{2}-\d{2}/;
                console.log(parameters)
                const date = parameters.date.match(dateRegex)[0];
                const values = [userId, date];  
                
                let data = `${userName}님의 ${date}일 사입계획서는 `;
                models.plan.check(values, (error, result) => {
                    if (error) {
                        console.error(error);
                        const errMsg = '조회에 실패했습니다.' 
                        return res.status(500).send(errMsg);
                        }
                    // 결과 문자열 합치기
                    if (result.length > 0) {
                        result.forEach(element => {
                            data += `\n${element.flower}` + `${element.unit}`;
                        });
                        data += "입니다";
                    }
                    // result에 아무것도 담겨있지 않을 경우
                    else {
                        data += "현재 존재하지 않습니다.";
                    }

                    const responseText = data;
                    console.log(data);
                    // Dialogflow webhook 응답을 구성합니다.
                    const response = {
                      fulfillmentText: responseText,
                    };
                  
                    // 웹훅 응답을 반환합니다.
                    return res.json(response);

                    
                });



            }

            else if (action === "price-check") {

                // 파라미터 데이터 가져오기
                const dateRegex = /\d{4}-\d{2}-\d{2}/;
                console.log(parameters)
                const date = parameters.date.match(dateRegex)[0];
                const flower = parameters.flower_1;
                const values = [date, flower];  
                
                let data = `${userName}님, ${date}일 ${flower}의 가격 정보는 `;
                models.price.check(values, (error, result) => {
                    if (error) {
                        console.error(error);
                        const errMsg = '조회에 실패했습니다.' 
                        return res.status(500).send(errMsg);
                        }
                    // 결과 문자열 합치기
                    if (result.length > 0) {
                        result.forEach(element => {
                            data += `\n${element.goodName} ${element.lvNm} 의 
                            최고가 : ${element.maxAmt},  
                            최저가 : ${element.minAmt}, 
                            평균가 : ${element.avgAmt}`;
                        });
                        data += "가 다음과 같이 형성되어 있습니다.";
                    }
                    // result에 아무것도 담겨있지 않을 경우
                    else {
                        data += "현재 존재하지 않습니다.";
                    }

                    const responseText = data;

                    // Dialogflow webhook 응답을 구성합니다.
                    const response = {
                      fulfillmentText: responseText,
                    };
                  
                    // 웹훅 응답을 반환합니다.
                    return res.json(response);

                    
                });



            }

        }),
        

    }
  }


