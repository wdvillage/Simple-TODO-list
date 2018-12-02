/* 
 * TODO
 */
var stkey = 0;
var hidediv=null;

//Wait for the DOM to load
$(function () {

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

        $('#todos').prepend("<li id=" + stkey + " draggable='true' ondragstart='return dragStart(event)'><div class='task'>" + tasktext + "</div><div class='button-container'><button id='edit'></button><button id='delete'></button></div></li>");
        //Clear input field 
        $('#form')[0].reset();

        var task = new Object();
        task.board = "todos";
        task.taskid = stkey;
        task.tasktext = tasktext;

        localStorage.setItem(stkey, JSON.stringify(task));
        stkey = stkey + 1;
        return false;
    });

    //If there is already data in the local storage, then display it
    var keyArr = [];
    var itemArr = [];
    for (var i = 0, len = localStorage.length; i < len; ++i) {
        keyArr.push(localStorage.key(i));
        itemArr.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
        if (itemArr[i].board === 'todos') {
            $('#todos').prepend("<li id=" + itemArr[i].taskid + " draggable='true' ondragstart='return dragStart(event)'><div class='task'>" + itemArr[i].tasktext + "</div><div class='button-container'><button id='edit'></button><button id='delete'></button></div></li>");
        } else {
            $('#completed').prepend("<li id=" + itemArr[i].taskid + " draggable='true' ondragstart='return dragStart(event)'><div class='task'>" + itemArr[i].tasktext + "</div><div class='button-container'><button id='edit'></button><button id='delete'></button></div></li>");
        }
    }

    // Cleaning localStorage 
    $('#clear').click(function () {
        window.localStorage.clear();
        location.reload();
        return false;
    });

    //Delete task
    $('.main').on('click', '#delete', function () {
        //delete item from board
        $(this).parent().parent().remove();
        var clickedID = $(this).parent().parent()[0];
        //delete item from localStorage
        localStorage.removeItem(clickedID.id);
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
        var task=JSON.parse(localStorage.getItem(taskId));
        task.tasktext = newText;

        localStorage.setItem(taskId, JSON.stringify(task)); 
        
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


function dragStart(ev) {
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
    ev.dataTransfer.setDragImage(ev.target, 0, 0);
    return true;
}
function dragEnter(ev) {
    event.preventDefault();
    return true;
}
function dragOver(ev) {
    event.preventDefault();
}
function dragDrop(ev) {
    var data = ev.dataTransfer.getData("Text");
    ev.target.appendChild(document.getElementById(data));
    var task = JSON.parse(localStorage.getItem(data));
    
    if (ev.target.getAttribute('id') === "completed") {
        task.board = "completed";
    } else {
        task.board = "todos";
    }
    localStorage.setItem(data, JSON.stringify(task));

    ev.stopPropagation();
    return false;
}