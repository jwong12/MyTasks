$(function ready() {
    $.getJSON("/api/tasks", function (data) {
        console.log(data);
        data.forEach(function (item) {
            $('#tasks').append(
                '<tr><td class="td-title">' + item.title + 
                '</td><td class="td-description">' + item.description + 
                '</td><td class="td-datefrom">' + item.datefrom + 
                '</td><td class="td-dateto">' + item.dateto + 
                '</td><td>' + item.priority + 
                '</td><td>' + item.category + 
                '</td><td class="td-status">' + item.status + '</td></tr>'
            );
        });
    });

});

