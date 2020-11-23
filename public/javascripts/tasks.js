const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOTW = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
let tasks = [];

const sortOrder = {
    status: '',
    date: '',
    priority: ''
};

$(function ready() {
    requestTasksApi();
});

function updateTask(taskProperty, taskIndex, propertyValue) {
    const task = tasks[taskIndex];
    task[taskProperty] = propertyValue;
    const taskCopy = Object.assign({}, {...task});
    delete taskCopy.dom;
    const jsonTask = JSON.stringify(taskCopy);

    $.ajax({
        url: '/api/tasks/update/:' + task._id,
        type: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        data: jsonTask,
        success: () => console.log('success')
    });
}

function deleteTask(id) {
    const taskId = JSON.stringify({ id });
    console.log(id);

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i]._id === id) {
            tasks.splice(i, 1);
            break;
        }
    }

    console.log(tasks)

    $.ajax({
        url: '/api/tasks/delete/:' + id,
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json',
        data: taskId,
        success: loadTasksDom()
    });
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

function removeAllRows() {
    const tableNode = document.getElementById('tasks');

    for (let i = tableNode.rows.length - 1; i > 0; i--) {
        tableNode.deleteRow(i);
    }
}

function loadTasksDom() {
    const tableNode = document.getElementById('tasks');
    const tBody = tableNode.getElementsByTagName('tbody')[0];
    removeAllRows();

    if (tasks.length > 0 && tasks[0].dom) {
        for (let i = 0; i < tasks.length; i++) {
            tBody.appendChild(tasks[i].dom);
        } 

    } else {
        for (let i = 0; i < tasks.length; i++) {
            const row = tableNode.insertRow(tableNode.rows.length);
            row.className = "row-task";
            row.setAttribute('data-taskid', tasks[i]._id);
            row.setAttribute('data-sortorder', i);
            const cellTask = row.insertCell(0);
            const cellCategory = row.insertCell(1);
            const cellDate = row.insertCell(2);        
            const cellStatus = row.insertCell(3);
            const cellPriority = row.insertCell(4);
            const cellDelete = row.insertCell(5);

            cellDate.className = "td-date";
            cellDate.setAttribute('id', 'date-tasks' + i);

            const divStatus = document.createElement('div');
            divStatus.className = "status";
            cellStatus.className = 'td-status';
            divStatus.addEventListener('click', () => selectStatus(i));
            cellStatus.appendChild(divStatus);

            let color;
            if (tasks[i].priority === "low") {
                color = '#29a229';

            } else if (tasks[i].priority === "medium") {
                color = '#a28f00';

            } else {
                color = '#c53e3e';
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
            const taskId = tasks[i]._id;
            buttonDelete.addEventListener('click', () => deleteTask(taskId));
            cellDelete.className = 'td-delete';
            cellDelete.appendChild(buttonDelete);

            cellTask.textContent = tasks[i].task;
            cellCategory.textContent = tasks[i].category;
            cellDate.textContent = formatDate(tasks[i].date);
            divStatus.textContent = tasks[i].status;
            divPriority.textContent = tasks[i].priority;
            tasks[i].dom = row;
        }
    }
}

function formatDate(date) {
    const year = date.slice(0,4);
    const month = date.slice(5,7);
    const day = parseInt(date.slice(8,10));
    const dateObj = new Date(Date.UTC(year, month-1, day, 12, 0, 0));
    return DOTW[dateObj.getDay()] + ', ' + MONTHS[month-1] + ' ' + day + ' ' + year;
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

function selectTaskProperty(taskProperty, taskPropertyOptions, taskPropertyNodes, taskIndex, changeTaskPropertyFunc) {
    const ul = document.createElement('ul');
    ul.className = 'ul-selection';

    for (let option of taskPropertyOptions) {
        const li = document.createElement('li');
        li.textContent = option;     
        li.addEventListener('click', () => {
            changeTaskPropertyFunc(taskPropertyNodes[taskIndex].childNodes[0], taskIndex, option);
            updateTask(taskProperty, taskIndex, option);

            switch(option) {
                case 'low':
                    taskPropertyNodes[taskIndex].childNodes[0].style.color = '#29a229';
                    break;
                case 'medium':
                    taskPropertyNodes[taskIndex].childNodes[0].style.color = '#a28f00';
                    break;
                case 'high':
                    taskPropertyNodes[taskIndex].childNodes[0].style.color = '#c53e3e';
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
        selectTaskProperty("status", statuses, tdStatusNodes, index, changeTaskStatus);
    }
}

function changeTaskStatus(node, index, newStatus) {
    if (tasks[index].status !== newStatus) {
        tasks[index].status = newStatus;
        node.textContent = newStatus;        
    }    
}

function selectPriority(index) {
    const tdPriorityNodes = document.getElementsByClassName('td-priority');

    if (tdPriorityNodes[index].childNodes.length < 2) {
        const priorities = ['low', 'medium', 'high'];
        selectTaskProperty("priority", priorities, tdPriorityNodes, index, changeTaskPriority);
    }
}

function changeTaskPriority(node, index, newPriority) {
    if (tasks[index].priority !== newPriority) {
        tasks[index].priority = newPriority;
        node.textContent = newPriority;
    }    
}

function handleClickOnDate() {
    console.log(tasks) //
    
    const rowDoms = document.getElementsByClassName('row-task');

    for (let i = 0; i < tasks.length; i++) {
        tasks[i].dom = rowDoms[i];

        if (rowDoms[i].childNodes[2].dataset.date && rowDoms[i].childNodes[2].dataset.date.length > 0) {
            for (let j = 0; j < tasks.length; j++) {
                if (rowDoms[i].dataset.taskid === tasks[j]._id) {
                    tasks[j].date = rowDoms[i].childNodes[2].dataset.date;
                    rowDoms[i].childNodes[2].setAttribute('data-date', '');
                }
            }
        }
    }

    if (sortOrder.date === '' || sortOrder.date === 'desc') {
        sortOrder.date = 'asc';
        tasks.sort((a, b) => compareDates(a.date, b.date));
        loadTasksDom();

    } else if (sortOrder.date === 'asc') {
        sortOrder.date = 'desc';
        tasks.sort((a, b) => compareDates(b.date, a.date));
        loadTasksDom();
    } 

    assignSortOrder();    
    sortOrder.status = '';
    sortOrder.priority = '';
}

function assignSortOrder() {
    const rowDoms = document.getElementsByClassName('row-task');

    for (let i = 0; i < rowDoms.length; i++) {
        rowDoms[i].dataset.sortorder = i;
    }
}

function compareDates(a, b) {
    if (a < b) {return -1;}
    if (a > b) {return 1;}
    return 0;
} 

function handleClickOnStatus() {
    if (sortOrder.status === '' || sortOrder.status === 'desc') {
        sortOrder.status = 'asc';
        sortByStatus('active');

    } else if (sortOrder.status === 'asc') {
        sortOrder.status = 'desc';
        sortByStatus('done');
    } 
    
    sortOrder.date = '';
    sortOrder.priority = '';
}

function sortByStatus(sortOrder) {
    let currIdx = 0;

    while(currIdx < tasks.length && tasks[currIdx].status === sortOrder) {
        currIdx++;
    }

    for (let i = currIdx+1; i < tasks.length; i++) {
        if (tasks[i].status === sortOrder) {
            const tmp = tasks[i];
            tasks[i] = tasks[currIdx];
            tasks[currIdx++] = tmp;
        }         
    }

    while(currIdx < tasks.length && tasks[currIdx].status === 'in progress') {
        currIdx++;
    }

    for (let i = currIdx + 1; i < tasks.length; i++) {
        if (tasks[i].status === 'in progress') {
            const tmp = tasks[i];
            tasks[i] = tasks[currIdx];
            tasks[currIdx++] = tmp;
        }         
    }

    loadTasksDom();
}

function handleClickOnPriority() {
    if (sortOrder.priority === '' || sortOrder.priority === 'desc') {
        sortOrder.priority = 'asc';
        sortByPriority('low');

    } else if (sortOrder.priority === 'asc') {
        sortOrder.priority = 'desc';
        sortByPriority('high');
    } 
    
    sortOrder.date = '';
    sortOrder.status = '';
}

function sortByPriority(sortOrder) {
    let currIdx = 0;

    while(currIdx < tasks.length && tasks[currIdx].priority === sortOrder) {
        currIdx++;
    }

    for (let i = currIdx+1; i < tasks.length; i++) {
        if (tasks[i].priority === sortOrder) {
            const tmp = tasks[i];
            tasks[i] = tasks[currIdx];
            tasks[currIdx++] = tmp;
        }         
    }

    while(currIdx < tasks.length && tasks[currIdx].priority === 'medium') {
        currIdx++;
    }

    for (let i = currIdx + 1; i < tasks.length; i++) {
        if (tasks[i].priority === 'medium') {
            const tmp = tasks[i];
            tasks[i] = tasks[currIdx];
            tasks[currIdx++] = tmp;
        }         
    }

    loadTasksDom();
}