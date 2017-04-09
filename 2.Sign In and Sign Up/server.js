const pg = require('pg');
const http = require('http');
const Pool = pg.Pool;
const databaseConfig = {
    host: 'localhost',
    port: 5432,
    user: 'soulike',
    password: 'SoulikeZhou',
    database: 'soulikesite'
};
let pool = new Pool(databaseConfig);

/*登录服务器*/
http.createServer(function (req, res)
{
    let userData = {};
    req.on('data', function (chunk)
    {
        let respond = {};

        userData = JSON.parse(anti_classify(chunk.toString()));

        let logText = 'User ' + userData.username + ' signed up ';
        let logStatus = '';
        let logReason = '';

        if (userData.cookie === false)
        {
            let cookieBody =
                {
                    username: "username=" + classify(userData.username) + ";" +
                    "expires=" + new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 30) + ";path='/'",
                    password: "password=" + classify(userData.password) + ";" +
                    "expires=" + new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 30) + ";path='/'",
                };

            res.writeHead(200, {
                'Content-Type': 'JSON',
                "Access-Control-Allow-Origin": "http://localhost:63342",
                'Access-Control-Allow-Credentials': 'true',
                "Set-Cookie": [cookieBody.username, cookieBody.password]
            });
        }
        else
        {
            res.writeHead(200, {
                'Content-Type': 'JSON',
                "Access-Control-Allow-Origin": "http://localhost:63342",
            });
            logReason = '(Reason: Login by cookie.)';
        }


        pool.query("SELECT * FROM user_data WHERE e_mail = $1", [userData.username], function (err, result)
        {
            if (err)
            {
                logStatus = 'failed. ';
                logReason = '(Reason: Database error.)';
                respond.status = 'FAILURE';
                respond.page = classify('');
            }
            else
            {
                if (result.rowCount)//数据库中存在该用户
                {
                    if (userData.password === result.rows[0].password)
                    {
                        logStatus = 'succeeded. ';
                        if (!logReason)
                            logReason = '(Reason: correct password.)';
                        respond.status = 'SUCCESS';
                        respond.page =
                            classify('<span id="response">' +
                                '<p> Welcome back, ' + result.rows[0].nick_name + '</p>'
                                + '<p>ID: ' + result.rows[0].id + '</p>'
                                + '<p>Phone Number: ' + result.rows[0].phone_number + '</p>'
                                + '</span>');
                    }
                    else
                    {
                        logStatus = 'failed. ';
                        logReason = '(Reason: Incorrect password.)';
                        respond.status = 'FAILURE';
                        respond.page = classify('');
                    }
                }
                else//不存在该用户
                {
                    logStatus = 'failed. ';
                    logReason = '(Reason: User does not exist.)';
                    respond.status = 'NONEXISTENT';
                    respond.page = classify('');
                }
            }
            res.write(JSON.stringify(respond));
            res.end();
            console.log(new Date() + ': ' + logText + logStatus + logReason);
        });
    })
}).listen(3000);

/*注册服务器*/
http.createServer(function (req, res)
{
    let userData = {};
    let respond = {};
    res.writeHead(200, {'Content-Type': 'JSON', "Access-Control-Allow-Origin": "*"});
    req.on('data', function (chunk)
    {
        userData = JSON.parse(chunk);

        let logText = 'User ' + userData.username + ' signed up ';
        let logStatus = '';
        let logReason = '';

        pool.query('INSERT INTO user_data VALUES ($1,$2,$3,$4)',
            [userData.username, userData.password, userData.nickName, userData.phoneNumber],
            function (err, result)
            {
                if (err)
                {
                    logStatus = 'failed. ';
                    if (err.code === '23505')
                    {
                        respond.status = 'REPEAT';
                        logReason = '(Reason: Repeated Email or phone number).';
                    }
                    else
                    {
                        respond.status = 'FAILURE';
                        logReason = '(Reason: database or client error).';
                    }
                    res.write(JSON.stringify(respond));
                    res.end();
                }
                else
                {
                    logStatus = 'succeed. ';
                    logReason = '(Reason: insert succeed).';
                    respond.status = 'SUCCESS';
                    respond.username = userData.username;
                    res.write(JSON.stringify(respond));
                    res.end();
                }
                console.log(new Date() + ': ' + logText + logStatus + logReason);
            });
    });
}).listen(3001);

/*找回密码服务器*/
http.createServer(function (req, res)
{
    let userData = {};
    req.on('data', function (chunk)
    {
        let respond = {};
        res.writeHead(200, {'Content-Type': 'JSON', "Access-Control-Allow-Origin": "*"});

        userData = JSON.parse(chunk);

        let logText = 'User ' + userData.username + ' tried to get back password ';
        let logStatus = '';
        let logReason = '';

        pool.query("SELECT * FROM user_data WHERE e_mail = $1", [userData.username], function (err, result)
        {
            if (err)
            {
                logStatus = 'failed. ';
                logReason = '(Reason: Database error.)';
                respond.status = 'FAILURE';
            }
            else
            {
                if (result.rowCount)//数据库中存在该用户而且信息正确
                {
                    if (userData.nickName === result.rows[0].nick_name && userData.phoneNumber === result.rows[0].phone_number)
                    {
                        logStatus = 'succeeded. ';
                        logReason = '(Reason: Correct information.)';
                        respond.status = 'SUCCESS';
                        respond.username = result.rows[0].e_mail;
                        respond.password = result.rows[0].password;
                    }
                    else
                    {
                        logStatus = 'failed. ';
                        logReason = '(Reason: Incorrect information.)';
                        respond.status = 'INCORRECT';
                    }
                }
                else//不存在该用户
                {
                    logStatus = 'failed. ';
                    logReason = '(Reason: User does not exist.)';
                    respond.status = 'NONEXISTENT';
                }
            }
            res.write(JSON.stringify(respond));
            res.end();
            console.log(new Date() + ': ' + logText + logStatus + logReason);
        });
    })
}).listen(3002);

function anti_classify(password)
{
    let antiClassified = '';
    for (let i = 0; i < password.length; i++)
    {
        antiClassified += String.fromCharCode(password.charCodeAt(i) / 2);
    }
    return antiClassified;
}

function classify(password)
{
    let classified = '';
    for (let i = 0; i < password.length; i++)
    {
        classified += String.fromCharCode(password.charCodeAt(i) * 2);
    }
    return classified
}