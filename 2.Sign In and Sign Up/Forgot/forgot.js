const $nickName = $('#nickName');
const $username = $('#username');
const $form = $('form');
const $submitMsg = $('#submitMsg');
const $phoneNumber = $('#phoneNumber');

$(function ()
{
    $form.submit(function (e)
    {
        e.preventDefault();
        let status = true;
        if ($nickName.length === 0)
        {
            status = false;
            $nickName.css('backgroundColor', 'red');
        }
        if ($username.length === 0)
        {
            status = false;
            $username.css('backgroundColor', 'red');
        }
        if ($phoneNumber.length === 0)
        {
            status = false;
            $phoneNumber.css('backgroundColor', 'red');
        }
        if (status === true)
        {
            $submitMsg.text('Submitting...');
            let userData = {};
            userData.nickName = $nickName.val();
            userData.username = $username.val();
            userData.phoneNumber = $phoneNumber.val();
            $.ajax(
                {
                    url: 'http://localhost:3002',
                    method: 'post',
                    data: JSON.stringify(userData),
                    timeout: 1000,
                    dataType: 'JSON',
                    success: function (response)
                    {
                        if (response.status === 'SUCCESS')
                        {
                            $submitMsg.text('Here is your account:\nEmail: ' + response.username + '\n Password: ' + response.password);
                        }
                        else if (response.status === 'FAILURE')
                        {
                            $submitMsg.text('Sorry, there is something wrong happened. Please try again.');
                        }
                        else if (response.status === 'INCORRECT')
                            $submitMsg.text('Sorry, please check your information above.');
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