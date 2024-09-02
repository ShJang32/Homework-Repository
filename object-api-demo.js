const express = require('express')
const app = express()

app.listen(1234)

// 채널정보 찍어주기
let youtuber1 = {
    channelTitle : "십오야",
    sub : "593만명",
    videoNum : "993개"
}

let youtuber2 = {
    channelTitle : "침착맨",
    sub : "227만명",
    videoNum : "6.6천개"
}

let youtuber3 = {
    channelTitle : "TEO",
    sub : "54.8만명",
    videoNum : "726개"
}

 app.get('/:nickname', function(req, res) {

    const {nickname} = req.params
     
    console.log(nickname.youtuber1,)
    console.log(nickname.youtuber2,)
    console.log(nickname.youtuber3)

    if (nickname == "@15ya.fullmoon") {
        res.json(youtuber1)
    } else if (nickname == "@ChimChakMan_Officail") {
        res.json(youtuber2)
    } else if (nickname == "@TEO_universe") {
        res.json(youtuber3)
    } else {
        res.json({
            message : "저희가 모르는 유튜버입니다."
        })
    }
    // 개발자가 예상하지 못한 에러 = 예외가 발생했다!
})

// app.get('/watch', function(req, res) {

//     // 객체의 비구조화
//     const {v, t} = req.query  // 키값별로 파라미터 넣어줘!
//     console.log(v)
//     console.log(t)

//     res.json({
//         video : v,
//         timeline : t
//     })
// })