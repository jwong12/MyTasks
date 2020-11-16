$(function ready() {
    $("#submitForm").submit(function (event) {
        event.preventDefault();
        
        const taskInfo = JSON.stringify({
            title: $('#task').val(),
            category: $('#category').val(),
            date: $('#date').val(),
            priority: $('#priorityOutputId').val(),
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

function changeInputRange(value) {
    switch (value) {
        case '1':
            return 'low';
        case '2':
            return 'medium';
        case '3':
            return 'high';
        default:
            return 'low';
    }
}
