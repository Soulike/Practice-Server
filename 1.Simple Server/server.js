/**
 * Created by soulike on 17-3-12.
 */
const fs = require('fs');
const http = require('http');
/*上传文件部分*/
http.createServer(function (request, response)
{
    let res = {};
    response.writeHeader(200, {'Content-Type': 'text', "Access-Control-Allow-Origin": "*"});
    request.on('data', function (chunk)
    {

        fs.writeFile('./files/1.txt', chunk, function (err)
        {
            if (err)
            {
                response.writeHeader(400, {'Content-Type': 'text', "Access-Control-Allow-Origin": "*"});
                console.log(err);
                res.data = 'Error!';
                res.msg = 'Error!';
                res = JSON.stringify(res);
                response.end(res);
            }
        })
    });
    request.on('end', function ()
    {
        fs.readFile('./files/1.txt', 'utf8', function (err, data)
        {
            res.data = data;
            res.msg = "Upload succeed.";
            res = JSON.stringify(res);
            response.end(res);
            console.log(res);
        });
    })
}).listen(8888);