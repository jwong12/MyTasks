let tasks = [];

$(function ready() {
    requestTasksApi();
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

function requestTasksApi() {
    $("#loader").show();    
    
    $.getJSON("/api/tasks", function (data) {
        if(data) {
            tasks = data;
            loadTasks();   
            $("#loader").hide();       
        }
    });
}

function loadTasks() {
    tasks.forEach(function (item) {
        let color;
        if (item.priority === "low") {
            color = '#29a229';

        } else if (item.priority === "high") {
            color = '#f53e3e';

        } else {
            color = '#9e9e0d';
        }

        $('#tasks').append(
            '<tr><td>' + item.task + 
            '</td><td class="td-category">' + item.category + 
            '</td><td class="td-date">' + item.date + 
            '</td><td class="td-status">' + item.status + 
            '</td><td class="td-priority" style="color:' + color + '">' + item.priority + 
            '</td><td class="td-btn"><button class="deleteBtn btn btn-primary" onClick="deleteTask(\'' + item._id + '\')">Delete</button>' + 
            '</td></tr>'
        );
    });
}
