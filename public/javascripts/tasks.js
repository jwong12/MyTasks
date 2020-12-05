const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOTW = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
let tasks = [];

const sortOrder = {
    task: '',
    category: '',
    date: '',
    status: '',
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
    });
}

function deleteTask(id) {
    const taskId = JSON.stringify({ id });

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i]._id === id) {
            tasks.splice(i, 1);
            break;
        }
    }

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
    $("#loader-bg").show();    
    $("#loader-wrapper").show();    
    $("#loader").show();    
    
    $.getJSON("/api/tasks", function (data) {
        if(data) {
            tasks = data;
            loadTasksDom();
            handleClickOnDateTh();
            $("#loader-bg").hide();     
            $("#loader-wrapper").hide();    
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
            const taskId = tasks[i]._id;
            const input = document.createElement('input');
            const inputObj = { isFocused: false };
            let originalInputText;

            cellTask.addEventListener('click', () => {
                handleInputChange(cellTask, 'task');
            }); 
    
            cellCategory.addEventListener('click', () => {
                handleInputChange(cellCategory, 'category');
            }); 

            function handleInputChange(cellDom, taskProperty) {
                if (!inputObj.isFocused) {
                    cellDom.className = 'td-activated';
                    input.className = 'td-input';
                    originalInputText = cellDom.textContent;
                    input.value = cellDom.textContent;
                    cellDom.textContent = '';
                    cellDom.appendChild(input);
                    input.focus();
                    inputObj.isFocused = true;
                    window.addEventListener('click', handleClickOutsideOfCell);
                    window.addEventListener('keydown', handleKeyPress);
                }      
    
                let isCellClickedAgain = false;
    
                function handleClickOutsideOfCell(e){   
                    if (!input.contains(e.target)) {
                        if (isCellClickedAgain) {
                            closeEditing();
                        }
    
                        isCellClickedAgain = true;
                    }         
                }
    
                function handleKeyPress(e) {
                    if (e.key === 'Enter') {
                        closeEditing();
                    }
                }
    
                function closeEditing() {
                    let currDomIndex = findCurrentDomIndex(taskId);

                    if (currDomIndex !== -1 && input.value !== originalInputText) {
                        updateTask(taskProperty, currDomIndex, input.value);
                    }

                    cellDom.textContent = input.value;
                    cellDom.className = '';
                    input.remove();
                    inputObj.isFocused = false;
                    window.removeEventListener('keydown', handleKeyPress);
                    window.removeEventListener('click', handleClickOutsideOfCell);
                }
            }

            cellDate.className = "td-date";
            cellDate.setAttribute('id', 'date-tasks' + i);

            const divStatus = document.createElement('div');
            divStatus.className = "status";
            cellStatus.className = 'td-status';
            divStatus.addEventListener('click', () => selectStatus(taskId));
            cellStatus.appendChild(divStatus);

            let color;
            if (tasks[i].priority === "low") {
                color = '#19bf19';

            } else if (tasks[i].priority === "medium") {
                color = '#f5b80f';

            } else {
                color = '#da3939';
            }
            const divPriority = document.createElement('div');
            divPriority.className = "priority";        
            divPriority.style.color = color;
            cellPriority.className = 'td-priority';
            divPriority.addEventListener('click', () => selectPriority(taskId));
            cellPriority.appendChild(divPriority);

            const buttonDelete = document.createElement('button');
            buttonDelete.innerText = 'delete';
            buttonDelete.className = 'deleteBtn btn';
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

function selectStatus(taskId) {
    const rowDoms = document.getElementsByClassName('row-task'); 
    const tdStatusNodes = document.getElementsByClassName('td-status');
    let index = -1;

    for (let i = 0; i < rowDoms.length; i++) {
        if (rowDoms[i].dataset.taskid === taskId) {
            index = i;
            break;
        } 
    }

    if(index < 0) return;

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

// Return the current dom index after any of the order sorting functionalities is clicked.
function findCurrentDomIndex(taskId) {
    const rowDoms = document.getElementsByClassName('row-task'); 

    for (let i = 0; i < rowDoms.length; i++) {
        if (rowDoms[i].dataset.taskid === taskId) {
            return i;
        } 
    }
    return -1;
}

function selectPriority(taskId) {
    const tdPriorityNodes = document.getElementsByClassName('td-priority');
    let currDomIndex = findCurrentDomIndex(taskId);
    if(currDomIndex < 0) return;

    if (tdPriorityNodes[currDomIndex].childNodes.length < 2) {
        const priorities = ['low', 'medium', 'high'];
        selectTaskProperty("priority", priorities, tdPriorityNodes, currDomIndex, changeTaskPriority);
    }
}

function changeTaskPriority(node, index, newPriority) {
    if (tasks[index].priority !== newPriority) {
        tasks[index].priority = newPriority;
        node.textContent = newPriority;
    }    
}

function selectTaskProperty(taskProperty, taskPropertyOptions, taskPropertyNodes, taskIndex, changeTaskPropertyFunc) {
    const ul = document.createElement('ul');
    ul.className = 'ul-selection';
    ul.style.top = taskPropertyNodes[taskIndex].getBoundingClientRect().height - 1 + 'px';

    for (let option of taskPropertyOptions) {
        const li = document.createElement('li');
        li.textContent = option;     

        li.addEventListener('click', () => {
            changeTaskPropertyFunc(taskPropertyNodes[taskIndex].childNodes[0], taskIndex, option);
            updateTask(taskProperty, taskIndex, option);

            switch(option) {
                case 'low':
                    taskPropertyNodes[taskIndex].childNodes[0].style.color = '#19bf19';
                    break;
                case 'medium':
                    taskPropertyNodes[taskIndex].childNodes[0].style.color = '#f5b80f';
                    break;
                case 'high':
                    taskPropertyNodes[taskIndex].childNodes[0].style.color = '#da3939';
                    break;
                default:
            }

            let propertySorted;
            
            for (const prop in sortOrder) {
                if (sortOrder[prop] === 'asc' || sortOrder[prop] === 'desc') {
                    if (prop === 'priority') {
                        sortByPriority();

                    } else {
                        sortByStatus();
                    }
                }
            }
        });
        ul.appendChild(li);
    }

    taskPropertyNodes[taskIndex].style.backgroundColor = "#fff5e7";
    taskPropertyNodes[taskIndex].childNodes[0].style.fontWeight = "bold";
    var taskPropertyNode = taskPropertyNodes[taskIndex];
    var taskPropertyNodeLi = taskPropertyNodes[taskIndex].childNodes[0];
    var isUlPopUpOpen = false;
    window.addEventListener('click', handleClickOnUl);
    taskPropertyNodes[taskIndex].appendChild(ul);  

    function handleClickOnUl(){   
        if (isUlPopUpOpen) {
            taskPropertyNode.style.backgroundColor = "#fcfeff";
            taskPropertyNodeLi.style.fontWeight = "600";
            ul.remove();
            window.removeEventListener('click', handleClickOnUl);
        }
        
        isUlPopUpOpen = true;
    }
}

function resetSortOrders(property, arrowImgDom) {
    const arrowImages = document.getElementsByClassName('img-arrow');
 
    for (const dom of arrowImages) {
        if (dom !== arrowImgDom) {
            dom.className = 'img-arrow';
        }
    }

    for (let prop in sortOrder) {
        if (prop !== property) {
            sortOrder[prop] = '';
        }
    }
}

function handleClickOnTh(property, sortFunc) {
    const arrowImgDom = document.getElementById('arrow-' + property);
    
    if (sortOrder[property] === '' || sortOrder[property] === 'desc') {
        sortOrder[property] = 'asc';
        arrowImgDom.className = 'img-arrow img-arrow-asc';
        sortFunc(property, false);

    } else if (sortOrder[property] === 'asc') {
        sortOrder[property] = 'desc';
        arrowImgDom.className = 'img-arrow img-arrow-desc';
        sortFunc(property, true);
    } 

    resetSortOrders(property, arrowImgDom);
}

function sortByAlphabet(property, isDescending) {
    tasks.sort((a, b) => {
        var x = a[property].toLowerCase();
        var y = b[property].toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    if (isDescending === true) {
        tasks.reverse();
    }

    loadTasksDom();
}

function handleClickOnDateTh() {    
    const rowDoms = document.getElementsByClassName('row-task');
    const arrowImgDom = document.getElementById('arrow-date');

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
        arrowImgDom.className = 'img-arrow img-arrow-asc';
        tasks.sort((a, b) => compareDates(a.date, b.date));
        loadTasksDom();

    } else if (sortOrder.date === 'asc') {
        sortOrder.date = 'desc';
        arrowImgDom.className = 'img-arrow img-arrow-desc';
        tasks.sort((a, b) => compareDates(b.date, a.date));
        loadTasksDom();
    } 

    resetSortOrders('date', arrowImgDom);
}

function compareDates(a, b) {
    if (a < b) {return -1;}
    if (a > b) {return 1;}
    return 0;
} 

function sortByStatus() {
    let order = (sortOrder.status === 'asc' ? 'active' : 'done');
    let currIdx = 0;

    while(currIdx < tasks.length && tasks[currIdx].status === order) {
        currIdx++;
    }

    for (let i = currIdx+1; i < tasks.length; i++) {
        if (tasks[i].status === order) {
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

function sortByPriority() {
    let order = (sortOrder.priority === 'asc' ? 'low' : 'high');
    let currIdx = 0;

    while(currIdx < tasks.length && tasks[currIdx].priority === order) {
        currIdx++;
    }

    for (let i = currIdx+1; i < tasks.length; i++) {
        if (tasks[i].priority === order) {
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