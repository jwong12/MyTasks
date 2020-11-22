$(function ready() {
    $("#submitForm").submit(function (event) {
        event.preventDefault();
        const date = $('#date').val();
        const day = date.toString().slice(8,10);
        const fullDate = date.toString().slice(0,8) + (parseInt(day) < 10 ? day.slice(1,2) : day) + date.toString().slice(10,15);

        const taskInfo = JSON.stringify({
            task: $('#task').val(),
            category: $('#category').val(),
            date: fullDate,
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
                $('#status-msg').removeClass();
                $('#status-msg').addClass('alert alert-success');
                $('#status-msg').html('The task was added.');
            },
            error: function (json) {
                $('#status-msg').removeClass();
                $('#status-msg').addClass('alert alert-danger');
                $('#status-msg').html(json.responseJSON.msg);
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
