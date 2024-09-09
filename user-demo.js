// express 모듈 세팅
const express = require('express')
const app = express()
app.use(express.json())
app.listen(7776)

let db = new Map()
let idx = 1

// let user1 = {
//     id : "abc",
//     pwd : "asdf123*"
// }

// 로그인
app.post('/login', function(req, res) {
    let {userId, password} = req.body
    let loginUser = {}

    // userId가 디비에 저장된게 있는지 확인
    loginUser = checkID(userId, loginUser)

    if (isExist(loginUser)) {
        console.log("아이디 일치")

        // pwd 비교
        if (loginUser.password === password) {
            console.log("로그인 되었습니다.")
        } else {
            console.log("비밀번호가 옳지 않습니다.")
        }
    } else {
        console.log("등록되지 않은 ID 입니다.")
    }
})

function checkID(userId, loginUser) {
    db.forEach(function(user, idx){
        // a: value, b: key, c: Map
        // console.log(`a: ${a}, b: ${b}, c: ${c}`)
        if (user.userId === userId) {
            loginUser = user
        }
    })
    return loginUser
}

function isExist(obj) {
    if (Object.keys(obj).length) {
        return true
    } else {
        return false
    }
}

// 회원가입
app.post('/signup', function(req, res) {
    console.log(req.body)
    // var {user_id} = req.body.userId
    // var {pwd} = req.body.password
    // var {name} = req.body.name



    if (Object.keys(req.body).length == 3) {
        db.set(idx++, req.body)
        console.log(db)
        console.log(Object.keys(req.body).length)

        res.status(201).json({
            message : `${db.get(idx-1).name}님 가입을 환영합니다~`
        })

    } else {
        res.status(400).json({
            message : `입력 값을 다시 확인해주세요.`
        })
    }
})

// 회원 개별 조회
app.get('/users/:id', function(req, res) {
    let {id} = req.params
    id = parseInt(id)
    const user = db.get(id)

    if (user){
        res.json({
            userId : user.userId,
            name : user.name,
            password : user.password
        })
    } else {
        res.status(404).json({
            message : "찾으시는 회원이 없습니다."
        })
    }
})

// 회원 개별 탈퇴
app.delete('/users/:id', function(req, res) {
    let {id} = req.params
    id = parseInt(id)
    let user = db.get(id)

    if (user){
        db.delete(id)

        res.json({
            message : `${user.name}님 다음에 뵙겠습니다.`
        })
    } else {
        res.status(404).json({
            message : "회원 정보가 존재하지 않습니다."
        })
    }
})
