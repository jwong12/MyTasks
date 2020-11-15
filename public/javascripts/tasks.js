$(function ready() {
    loadTasks();
});

function deleteTask(id) {
    const taskId = JSON.stringify({
        id
    });

    $.ajax({
        url: '/api/tasks/:' + id,
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json',
        data: taskId,
        success: refreshPage()
    })
}

function refreshPage() {
    location.reload();
}

function loadTasks() {
    $("#loader").show();    
    
    $.getJSON("/api/tasks", function (data) {
        if(data) {
            $("#loader").hide();
            
            data.forEach(function (item) {
                $('#tasks').append(
                    '<tr><td>' + item.task + 
                    '</td><td>' + item.category + 
                    '</td><td class="td-date">' + item.date + 
                    '</td><td>' + item.priority + 
                    '</td><td class="td-status">' + item.status + 
                    '</td><td class="td-btn"><button class="deleteBtn btn btn-primary" onClick="deleteTask(\'' + item._id + '\')">Remove</button>' + 
                    '</td></tr>'
                );
            });
        }
    });
}
