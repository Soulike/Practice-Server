const $nickName = $('#nickName');
const $username = $('#username');
const $password = $('#password');
const $phoneNumber = $('#phoneNumber');
const $passwordAgain = $('#passwordAgain');
const $form = $('form');
const $allInputs = $('input[class=text]');
const $submitMsg = $('#submitMsg');
const $allPassword = $('#password,#passwordAgain');
const $showPassword = $('#showPassword');

const nickNameReg = /^[0-9A-z]{5,20}$/;
const usernameReg = /^[0-9A-z]+@([0-9A-z]+\.)+[a-z]+$/;
const passwordReg = /^([A-z]+[0-9A-z]*){6,20}$/;
const phoneNumberReg = /^[0-9]{11}$/;

$(function ()
{
    $allInputs.click(function ()
    {
        $allInputs.css('backgroundColor', 'white');
    });

    $allPassword.keyup(function ()
    {
        if ($passwordAgain.val())
            if ($password.val() !== $passwordAgain.val())
            {
                $password.css('backgroundColor', 'red');
                $passwordAgain.css('backgroundColor', 'red');
            }
            else
            {
                $password.css('backgroundColor', 'white');
                $passwordAgain.css('backgroundColor', 'white');
            }
    });

    $allPassword.blur(function ()
    {
        if (!$password.val() && !$passwordAgain.val())
        {
            $password.css('backgroundColor', 'white');
            $passwordAgain.css('backgroundColor', 'white');
        }
    });

    $showPassword.click(function ()
    {
        if ($showPassword.is(':checked'))
            $allPassword.attr('type', 'text');
        else
            $allPassword.attr('type', 'password');
    });
});

$(function ()
{
    $form.submit(function (e)
    {
        e.preventDefault();
        let status = true;
        if (!nickNameReg.test($nickName.val()))
        {
            status = false;
            $nickName.css('backgroundColor', 'red');
        }
        if (!usernameReg.test($username.val()))
        {
            status = false;
            $username.css('backgroundColor', 'red');
        }
        if (!passwordReg.test($password.val()))
        {
            status = false;
            $password.css('backgroundColor', 'red');
        }
        if (!phoneNumberReg.test($phoneNumber.val()))
        {
            status = false;
            $phoneNumber.css('backgroundColor', 'red');
        }
        if ($password.val() !== $passwordAgain.val())
        {
            status = false;
        }
        if (status === true)
        {
            $submitMsg.text('Submitting...');
            let userData = {};
            userData.nickName = $nickName.val();
            userData.username = $username.val();
            userData.password = $password.val();
            userData.phoneNumber = $phoneNumber.val();
            $allPassword.val('');
            $.ajax(
                {
                    url: 'http://localhost:3001',
                    method: 'post',
                    data: JSON.stringify(userData),
                    timeout: 1000,
                    dataType: 'JSON',
                    success: function (response)
                    {
                        if (response.status === 'SUCCESS')
                        {
                            $submitMsg.text(response.username + ' signed up successfully.');
                        }
                        else if (response.status === 'REPEAT')
                        {
                            $submitMsg.text('Your E-Mail or Phone number has been used.');
                        }
                        else if (response.status === 'FAILURE')
                        {
                            $submitMsg.text('Sorry,something wrong happened. Please try again.');
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