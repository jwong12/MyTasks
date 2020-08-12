$(function ready() {
    $("#submitForm").submit(function (event) {
        event.preventDefault();
        
        const taskInfo = JSON.stringify({
            title: $('#title').val(),
            description: $('#description').val(),
            datefrom: $('#datefrom').val(),
            dateto: $('#dateto').val(),
            priority: $('#priority').val(),
            category: $('#category').val(),
            status: $('input[name="status"]:checked').val()
        });

        $.ajax({
            url: '/api/tasks',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: taskInfo,
            success: function () {
                $('#statusMsg').removeClass();
                $('#statusMsg').addClass('alert alert-success');
                $('#statusMsg').html('The task was added.');
            },
            error: function (json) {
                $('#statusMsg').removeClass();
                $('#statusMsg').addClass('alert alert-danger');
                $('#statusMsg').html(json.responseJSON.msg);
            }
        });
    });
});


