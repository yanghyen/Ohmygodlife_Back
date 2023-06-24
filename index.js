const apiKey = "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"
const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
var cors = require('cors')
const app = express()

const configuration = new Configuration({
    apiKey: apiKey,
  });
const openai = new OpenAIApi(configuration);

//CORS 이슈 해결
// let corsOptions = {
//     origin: 'https://www.domain.com',
//     credentials: true
// }
app.use(cors());

//POST 요청 받을 수 있게 만듬
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/fortuneTell', async function (req, res) {
    let { userMessages, assistantMessages} = req.body

    let messages = [
        {role: "system", content: "당신은 세계 최고의 대학 생활 컨설턴트 입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 각 대학생의 학과와 시기의 정보를 바탕으로 필요한 정보를 제공할 수 있습니다. 여러 분야 별로 필요한 자격증과 주요 커리큘럼 등에 대한 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
        {role: "user", content: "당신은 세계 최고의 대학 생활 컨설턴트 입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 각 대학생의 학과와 시기의 정보를 바탕으로 필요한 정보를 제공할 수 있습니다. 여러 분야 별로 필요한 자격증과 주요 커리큘럼 등에 대한 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
        {role: "assistant", content: "안녕하세요! 대학 생활에 관한 질문이 있으신가요? 어떤 것이든 물어보세요, 최선을 다해 답변해 드리겠습니다."},
    ]

    while (userMessages.length != 0 || assistantMessages.length != 0) {
        if (userMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "user", "content": "'+String(userMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
        if (assistantMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "assistant", "content": "'+String(assistantMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
    }

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
    });
    let fortune = completion.data.choices[0].message['content']

    res.json({"assistant": fortune});
});

app.listen(3000)