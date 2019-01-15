/* 
 * TODO
 */
var hidediv=null;

//Wait for the DOM to load
$(function () {
   var tasks=[];
    //Focus in input
    $('#tasktext').focus();

    //Add new task
    $('#add').click(function () {
        var tasktext = $('#tasktext').val();

        //If the text field is not filled
        if ($("#tasktext").val() === '') {
            $('#message').html("Attention! Enter an entry in the text box.");
            $('#message').fadeIn().delay(1000).fadeOut();
            return false;
        }

        $('#todos').prepend("<li id=" + tasks.length + " draggable='true' ondragstart='dragStart(event)'><div class='task'>" + tasktext + "</div><div class='button-container'><button id='edit'></button><button id='delete'></button></div></li>");
        //Clear input field 
        $('#form')[0].reset();

        var task = new Object();
        task.todos = false;
        task.taskid = tasks.length+10;
        task.tasktext = tasktext;
        tasks.push(task);
        localStorage.setItem('simpleTodoList', JSON.stringify(tasks));
        return false;
    });

    //If there is already data in the local storage, then display it
    if (localStorage.getItem('simpleTodoList')){
        var todoList = JSON.parse(localStorage.getItem('simpleTodoList'));
        todoList.forEach(function(item, i, todoList) {
            if (item.todos === false) {
                $('#todos').prepend("<li id=" + item.taskid + " draggable='true' ondragstart='dragStart(event)'><div class='task'>" + item.tasktext + "</div><div class='button-container'><button id='edit'></button><button id='delete'></button></div></li>");
            } else {
                $('#completed').prepend("<li id=" + item.taskid + " draggable='true' ondragstart='dragStart(event)'><div class='task'>" + item.tasktext + "</div><div class='button-container'><button id='edit'></button><button id='delete'></button></div></li>");
            }
        });
    }

    // Cleaning localStorage 
    $('#clear').click(function () {
        //window.localStorage.clear();
        localStorage.removeItem('simpleTodoList');
        location.reload();
        return false;
    });

    //Delete task
    $('.main').on('click', '#delete', function () {
        //delete item from board
        $(this).parent().parent().remove();
        var clickedID = $(this).parent().parent()[0];
        //delete item from localStorage
        var tasks=JSON.parse(localStorage.getItem('simpleTodoList'));
        tasks.splice(clickedID.id, 1);
        localStorage.setItem('simpleTodoList', JSON.stringify(tasks));
        return false;
    });


    //Edit task
    $('#todos').on('click', '#edit', function () {
        var newstr = $(this).parent().parent().text();
 
        //Hide task and button's container
        hidediv=$(this).parent().parent().children();
        hidediv.css("display", "none");

        $(this).parent().parent().prepend("<input type='text' id='edittext' name='edittext' value=''><div class='button-container'><button id='save'></button><button id='cancel'></button></div>");
        $('li input').val(newstr);

    return false;
    });

    // Save changes after edit
    $('#todos').on('click', '#save', function () {
        //Get new text
        var newText=$('#edittext').val();

        var saveTask =  $(event.target).parent().parent();
        var taskId=saveTask.attr( "id" );
        var tasks=JSON.parse(localStorage.getItem('simpleTodoList'));
        var task=tasks[taskId];
        task.tasktext = newText;
        tasks[taskId]=task;
        localStorage.setItem('simpleTodoList', JSON.stringify(tasks));
        
        document.getElementById("edittext").remove();
        hidediv.css("display", "block");

        var name='#'+taskId+' '+'.task';
        $(name).replaceWith("<div class='task'>" +newText+ "</li>");
    });

    // Cancel editing 
    $('#todos').on('click', '#cancel', function () {
        document.getElementById("edittext").remove();
        hidediv.css("display", "block");
    });
    
});


function dragStart(event) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData("Text", event.target.getAttribute('id'));
    event.dataTransfer.setDragImage(event.target, 0, 0);
    return true;
}
function dragEnter(event) {
    event.preventDefault();
    return true;
}
function dragOver(event) {
    event.preventDefault();
}
function dropped(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("Text");
    if (event.target.nodeName === "OL" || event.target.nodeName === "ol") {  
        event.target.appendChild(document.getElementById(data));
      } 

    var tasks=JSON.parse(localStorage.getItem('simpleTodoList'));   
    var task = tasks[data];
    if (event.target.getAttribute('id') === "completed") {
        task.todos = true;
    } else {
        task.todos = false;
    }
    localStorage.setItem('simpleTodoList', JSON.stringify(tasks));

    event.stopPropagation();
    return false;
}