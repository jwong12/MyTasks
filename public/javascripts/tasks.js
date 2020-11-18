let tasks = [];

$(function ready() {
    requestTasksApi();
});

function deleteTask(id) {
    const taskId = JSON.stringify({
        id
    });

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i]._id === id) {
            tasks.splice(i, 1);
            break;
        }
    }

    $.ajax({
        url: '/api/tasks/:' + id,
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json',
        data: taskId,
        success: reloadTasksDom()
    })   
}

function requestTasksApi() {
    $("#loader").show();    
    
    $.getJSON("/api/tasks", function (data) {
        if(data) {
            tasks = data;
            loadTasksDom();   
            $("#loader").hide();       
        }
    });
}

function reloadTasksDom() {
    removeAllRows();
    loadTasksDom();
}

function removeAllRows() {
    const tableNode = document.getElementById('tasks');

    for (let i = tableNode.rows.length - 1; i > 0; i--) {
        tableNode.deleteRow(i);
    }
}

function loadTasksDom() {
    const tableNode = document.getElementById('tasks');
    removeAllRows();

    for (let i = 0; i < tasks.length; i++) {
        const row = tableNode.insertRow(tableNode.rows.length);
        const cellTask = row.insertCell(0);
        const cellCategory = row.insertCell(1);
        const cellDate = row.insertCell(2);
        const cellStatus = row.insertCell(3);
        const cellPriority = row.insertCell(4);
        const cellDelete = row.insertCell(5);

        const divStatus = document.createElement('div');
        divStatus.className = "status";
        cellStatus.className = 'td-status';
        divStatus.addEventListener('click', () => selectStatus(i));
        cellStatus.appendChild(divStatus);

        let color;
        if (tasks[i].priority === "low") {
            color = '#29a229';

        } else if (tasks[i].priority === "medium") {
            color = '#9e9e0d';

        } else {
            color = '#f53e3e';
        }
        const divPriority = document.createElement('div');
        divPriority.className = "priority";        
        divPriority.style.color = color;
        cellPriority.className = 'td-priority';
        divPriority.addEventListener('click', () => selectPriority(i));
        cellPriority.appendChild(divPriority);

        const buttonDelete = document.createElement('button');
        buttonDelete.innerText = 'Delete';
        buttonDelete.className = 'deleteBtn btn btn-primary';
        buttonDelete.addEventListener('click', () => deleteTask(tasks[i]._id));
        cellDelete.appendChild(buttonDelete);

        cellTask.textContent = tasks[i].task;
        cellCategory.textContent = tasks[i].category;
        cellDate.textContent = tasks[i].date;
        divStatus.textContent = tasks[i].status;
        divPriority.textContent = tasks[i].priority;
    }
}

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

function selectTaskProperty(taskPropertyOptions, taskPropertyNodes, taskIndex, changeTaskPropertyFunc) {
    const ul = document.createElement('ul');
    ul.className = 'ul-selection';

    for (let option of taskPropertyOptions) {
        const li = document.createElement('li');
        li.textContent = option;     
        li.addEventListener('click', () => {
            console.log('li clicked'); //
            changeTaskPropertyFunc(taskPropertyNodes[taskIndex].childNodes[0], taskIndex, option);
            switch(option) {
                case 'low':
                    taskPropertyNodes[taskIndex].childNodes[0].style.color = '#29a229';
                    break;
                case 'medium':
                    taskPropertyNodes[taskIndex].childNodes[0].style.color = '#9e9e0d';
                    break;
                case 'high':
                    taskPropertyNodes[taskIndex].childNodes[0].style.color = '#f53e3e';
                    break;
                default:
            }
        });
        ul.appendChild(li);
    }

    taskPropertyNodes[taskIndex].childNodes[0].style.fontWeight = "bold";
    window.addEventListener('click', handleClickOnUl);
    taskPropertyNodes[taskIndex].appendChild(ul);  
    let isUlPopUpOpen = false;

    function handleClickOnUl(){   
        console.log('window clicked'); //

        if (isUlPopUpOpen) {
            taskPropertyNodes[taskIndex].childNodes[0].style.fontWeight = "normal";
            ul.remove();
            window.removeEventListener('click', handleClickOnUl);
        }
        
        isUlPopUpOpen = true;
    }
}

function selectStatus(index) {
    const tdStatusNodes = document.getElementsByClassName('td-status');

    if (tdStatusNodes[index].childNodes.length < 2) {
        const statuses = ['active', 'in progress', 'done'];
        selectTaskProperty(statuses, tdStatusNodes, index, changeTaskStatus);
    }
}

function changeTaskStatus(node, index, newStatus) {
    tasks[index].status = newStatus;
    node.textContent = newStatus;
}

function selectPriority(index) {
    const tdPriorityNodes = document.getElementsByClassName('td-priority');

    if (tdPriorityNodes[index].childNodes.length < 2) {
        const priorities = ['low', 'medium', 'high'];
        selectTaskProperty(priorities, tdPriorityNodes, index, changeTaskPriority);
    }
}

function changeTaskPriority(node, index, newPriority) {
    tasks[index].priority = newPriority;
    node.textContent = newPriority;
}