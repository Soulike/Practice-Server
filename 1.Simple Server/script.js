/**
 * Created by soulike on 17-3-16.
 */
$(function ()
{
    const $upload = $('#upload');
    const $uploadBtn = $('#uploadBtn');
    const $uploadMessage = $('#uploadMessage');
    const $fileContent = $('#fileContent');
    $upload.submit(function (e)
    {
        e.preventDefault();
        if (!$uploadBtn.val())
        {
            $uploadMessage.text('Invalid file. Please check.');
        }
        else
        {
            $.ajax(
                {
                    url: 'http://localhost:8888',
                    method: 'post',
                    dataType: 'text',
                    timeout: '10000',
                    cache: false,
                    data: new FormData($upload[0]),
                    processData: false,
                    contentType: false,
                    success: function (response)
                    {
                        response = JSON.parse(response);
                        $uploadMessage.text(response.msg.toString());
                        $fileContent.text(response.data.toString());
                    },
                    error: function ()
                    {
                        $uploadMessage.text('Error!');
                    }
                }
            );
        }
    });
});

