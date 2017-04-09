/**
 * Created by 31641 on 2017-3-20.
 */
/*图片轮换*/
$(function ()
{
    const $imageArea = $('#imageArea');

    setInterval(function ()
    {
        let image;
        let i = Math.round(Math.random() * 7 + 1);
        image = "url(images/image" + i + ".jpg)";
        $imageArea.css("backgroundImage", image);
    }, 5000);
});

/*提交cookie*/
$(function ()
{
    let cookieContent;
    const $form = $('form');
    let Cookie = document.cookie;
    if (Cookie)
    {
        cookieContent = cookieParse(Cookie);

        let userData = {};
        userData.username = anti_classify(cookieContent.username);
        userData.password = anti_classify(cookieContent.password);
        userData.cookie = true;
        $.ajax(
            {
                url: 'http://localhost:3000',
                method: 'post',
                data: classify(JSON.stringify(userData)),
                timeout: 1000,
                dataType: 'JSON',
                success: function (response)
                {
                    if (response.status === 'SUCCESS')
                    {
                        $form.html(anti_classify(response.page));
                    }
                },
                error: function (err)
                {
                    console.log(err);
                }
            })
    }
});

/*没有cookie时*/
$(function ()
{
    const $username = $('#username');
    const $password = $('#password');
    const $usernameMsg = $('#usernameMsg');
    const $passwordMsg = $('#passwordMsg');
    const $submitMsg = $('#submitMsg');
    const $form = $('form');
    $username.click(function ()
    {
        $username.css('backgroundColor', 'white');
        $usernameMsg.text('');
    });
    $password.click(function ()
    {
        $password.css('backgroundColor', 'white');
        $passwordMsg.text('');
    });
    $form.submit(function (e)
    {
        e.preventDefault();
        if (!$username.val())
        {
            $username.css('backgroundColor', 'red');
            $usernameMsg.text('Empty email. Please check.');
        }
        if (!$password.val())
        {
            $password.css('backgroundColor', 'red');
            $passwordMsg.text('Empty password. Please check.');
        }
        if ($username.val() && $password.val())
        {
            $submitMsg.text('Signing In...');
            let userData = {};
            userData.username = $username.val();
            userData.password = $password.val();
            userData.cookie = false;
            $.ajax(
                {
                    xhrFields: {
                        withCredentials: true
                    },
                    url: 'http://localhost:3000',
                    method: 'post',
                    data: classify(JSON.stringify(userData)),
                    timeout: 1000,
                    dataType: 'JSON',
                    success: function (response)
                    {
                        if (response.status === 'SUCCESS')
                        {
                            $form.html(anti_classify(response.page));
                        }
                        else if (response.status === 'FAILURE')
                        {
                            $submitMsg.text('Sorry, please try again.');
                        }
                        else if (response.status === 'NONEXISTENT')
                        {
                            $submitMsg.text('Sorry, no such user. Please check');
                        }
                    },
                    error: function ()
                    {
                        $submitMsg.text('Sorry, please try again.');
                    }
                }
            )
        }

    })
});

function cookieParse(Cookie)//解析cookie
{
    let cookieObject = {};
    let keys = Cookie.split(';');//获取每个键值对
    for (let i = 0; i < keys.length; i++)
    {
        keys[i] = keys[i].split('=');
        cookieObject[keys[i][0].replace(/\s/g, '')] = keys[i][1].replace(/\s/g, '');
    }
    return cookieObject;
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

function anti_classify(password)
{
    let antiClassified = '';
    for (let i = 0; i < password.length; i++)
    {
        antiClassified += String.fromCharCode(password.charCodeAt(i) / 2);
    }
    return antiClassified;
}