const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const {body, param, validationResult} = require('express-validator');

// jwt 모듈
const jwt = require('jsonwebtoken');

// dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

const validate = (req, res, next) => { // 변수에 함수를 담아서 모듈화함
    const err = validationResult(req)
            
    if (err.isEmpty()) {
        return next(); // 에러가 일어나지 않음, 다음 함수 or 미들웨어 호출
    } else {
        return res.status(400).json(err.array()) 
    }
};

router.use(express.json());

// 로그인
router.post(
    '/login',
    [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
        validate
    ],
    function(req, res) {
        let {email, password} = req.body

        let sql =`SELECT * FROM users WHERE email = ?`
        conn.query(sql, email,
            function (err, results) {
                if(err) {
                    console.log(err)
                    return res.status(400).end()
                }

                var loginUser = results[0]

                if(loginUser && loginUser.password == password) {
                    // token 발급
                    const token = jwt.sign({
                        email : loginUser.email,
                        name : loginUser.name
                    }, process.env.PRIVATE_KEY, {
                        expiresIn : "30m",
                        issuer : "ddae"
                    });

                    res.cookie("token", token, {
                        httpOnly : true
                    })

                    console.log(token)
                    res.status(200).json({
                        message : `${loginUser.name}님 로그인 되었습니다.`
                    })
                } else {
                    res.status(403).json({
                        message : "이메일 또는 비밀번호가 틀렸습니다."
                    })
                }
            }
        )
})

// 회원가입
router.post(
    '/join', 
    [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        body('name').notEmpty().isString().withMessage('이름 확인 필요'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
        body('contact').notEmpty().isString().withMessage('번호 확인 필요'),
        validate
    ],
    function(req, res) {
        const {email, name, password, contact} = req.body
        
        let sql =`INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)`
        let values = [email, name, password, contact]
        conn.query(sql, values,
            function (err, results) {
                if(err) {
                    console.log(err)
                    return res.status(400).end()
                }

                res.status(201).json(results)
            }
        )
    })

// 회원 개별 조회
router
    .route('/users')
    .get(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
            validate
        ],
        function(req, res) {
            let {email} = req.body

            let sql = `SELECT * FROM users WHERE email = ?`
            conn.query(sql, email,
                function (err, results) {
                    if(err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    res.status(201).json(results)
                }
            )
        })
    .delete( // 회원 탈퇴
        [
            body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
            validate
        ],
        function(req, res) {
            let {email} = req.body

            let sql = `DELETE FROM users WHERE email = ?`
            conn.query(sql, email,
                function (err, results) {
                    if(err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.affectedRows == 0)
                        return res.status(400).end()
                    else {
                        res.status(200).json(results)
                    }                
                }
            )
        })

module.exports = router