$(function ready() {
    loadTasks();
});

function deleteTask(id) {
    const taskId = JSON.stringify({
        id
    });

    const tableRows = $('#tasks tr');

    for(let i = 1; i < tableRows.length; i++) {
        tableRows[i].remove();
    }

    $.ajax({
        url: '/api/tasks/:' + id,
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json',
        data: taskId
    })
        
    loadTasks();
}

function loadTasks() {
    $("#loader").show();
    
    $.getJSON("/api/tasks", function (data) {
        if(data) {
            $("#loader").hide();
            
            data.forEach(function (item) {
                $('#tasks').append(
                    '<tr><td>' + item.title + 
                    '</td><td>' + item.description + 
                    '</td><td class="td-datefrom">' + item.datefrom + 
                    '</td><td class="td-dateto">' + item.dateto + 
                    '</td><td>' + item.priority + 
                    '</td><td>' + item.category + 
                    '</td><td class="td-status">' + item.status + 
                    '</td><td class="td-btn"><button class="deleteBtn" onClick="deleteTask(\'' + item._id + '\')">Remove</button>' + 
                    '</td></tr>'
                );
            });
        }
    });
}
