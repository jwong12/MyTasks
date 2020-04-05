$(function ready() {
    $.getJSON("/api/tasks", function (data) {
        console.log(data);
        data.forEach(function (item) {
            $('#tasks').append(
                '<tr><td>' + item.title + 
                '</td><td>' + item.description + 
                '</td><td>' + item.datefrom + 
                '</td><td>' + item.dateto + 
                '</td><td>' + item.priority + 
                '</td><td>' + item.category + 
                '</td><td>' + item.status + '</td></tr>'
            );
        });
    });

});

