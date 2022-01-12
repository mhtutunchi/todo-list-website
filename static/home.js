
var userid = $("#userid").val();

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


function loadMyTodos(searchText,filter) {

    var apiEndpoint='/api.php?action=get&userid=' + userid;
    if (!(searchText === undefined || searchText=="")) {
        apiEndpoint+="&search="+searchText;
    }
    if (!(filter === undefined)) {
        apiEndpoint+="&filter=1";
    }

    $.ajax({
        url:apiEndpoint ,
        async: true,
        complete: function (response) {

            $("#mytable").html("");

            
            var jsonData = JSON.parse(response.responseText);


            for (var i = 0; i < jsonData.length; i++) {

                var newRowContent = '<tr>';

                var id = jsonData[i].id;
                var desc = jsonData[i].description;
                var status = String(jsonData[i].status);

                // ID Column
                newRowContent += '<td class="col">$id</td>';

                // Status Column
                newRowContent += '<td class="col">';
                if (status == '0') {
                    newRowContent += "<input type='checkbox' id='c$id' class='status' value='$id'>";
                } else {
                    newRowContent += "<input type='checkbox' id='c$id' class='status' value='$id' checked='true'>";
                }
                newRowContent += '</td>';

                // Description Column
                newRowContent += '<td class="col">$desc</td>';

                // Action buttons Column
                newRowContent += '<td class="col"> <div class="btn-group pull-right">';
                newRowContent += '<a title="Delete" style="padding:4px;" class="btn btn-danger btn-xs delete-button" onclick="deleteItem($id);">Delete</a>';
                newRowContent += '<a style="margin-left: 2px; padding:4px;" title="Edit" class="btn btn-info btn-xs edit-button" onclick="editItem($id,&quot;$desc&quot;);">Edit</a></div> </td>';
                newRowContent = newRowContent.replaceAll("$id", id).replaceAll("$desc", desc);

                newRowContent += '</tr>';
                $("#mytable").append(newRowContent);

                
            }

        },
        error: function () {
            alertify.error("Error while connecting from database!");
        },
    });
}



function insertItem() {

    var val = document.getElementById("txtNewItem").value;
    if (val.length < 1) {
        alertify.error("Item description connot be empty!");
        return false;
    } else {

        var new_desc = document.getElementById("txtNewItem").value;
        document.getElementById("txtNewItem").value = "";
        $.ajax({
            url: "api.php?action=insert&userid=" + userid + "&desc=" + new_desc,
            complete: function (response) {
                var status = JSON.parse(response.responseText);
                // console.log(response);
                if (status.status == "success") {
                    alertify.success("New item has been added successfully");
                } else if (status.status == "error") {
                    alertify.error("Error while adding the item");
                }
                loadMyTodos(); //  reload the todo list from database
            },
            error: function () {
                alertify.error("Error while connecting from database!");
            },
        });

    }

}



function deleteItem(id) {
    alertify.confirm("Are you sure to delete this item?", function (e) {
        if (e) {
            $.ajax({
                url: 'api.php?action=delete&id=' + id,
                complete: function (response) {
                    var status = JSON.parse(response.responseText);
                    if (status.status == "success") {
                        alertify.success("Item Deleted !");
                        loadMyTodos();
                    } else if (status.status == "error") {
                        alertify.error("Error while deleting the item!");
                    }
                },
                error: function () {
                    alertify.error("Error while connecting from database!");
                },
            });
        }
    });
}


function editItem(id, desc) {
    alertify.prompt("Edit", "New todo description :", desc, function (e, str) {
        if (e) {
            if (str.length > 0) {
                if (document.getElementById('c' + String(id)).checked) {
                    var stat = 1;
                } else {
                    var stat = 0;
                }
                $.ajax({

                    url: 'api.php?action=edit&id=' + id + "&new_desc=" + str + "&new_status=" + stat,
                    complete: function (response) {
                        var status = JSON.parse(response.responseText); //parsing status from response received from php
                        if (status.status == "success") {
                            alertify.success("Information updated successfully");
                            loadMyTodos();

                        } else if (status.status == "error") {
                            alertify.error("Error while editing the item");
                        }
                    },
                    error: function () {
                        alertify.error("Error while connecting from database!");
                    },
                });

            } else {
                alertify.error("Item description cannot be empty !");
            }
        }
    }, desc);
}


$('body').on('change', '.status', function () {

    var tid = parseInt(String(this.id).replace("c", ""));

    if ($(this).is(":checked")) {
        var stat = 1;
    } else {
        var stat = 0;
    }

    $.ajax({
        url: 'api.php?action=edit&id=' + tid + "&new_status=" + stat,
        async: true,
        complete: function (response) {
            var status = JSON.parse(response.responseText);
            if (status.status == "success") {
                alertify.success("Status changed successfully!");
                loadMyTodos();


            } else if (status.status == "error") {
                alertify.error("Error while editing the item !");
            }
        },
        error: function () {
            alertify.error("Error while connecting from database!");
        },
    });
});



$("#filter").change(function() {
    if(this.checked) {
        loadMyTodos(document.getElementById("txtSearch").value,true)
    }
    else{
        loadMyTodos(document.getElementById("txtSearch").value,undefined)
    }
});

function search(text)
{
    if (text!="")
    {
        if  ($("#filter").is(":checked")){
            loadMyTodos(text,true);
        }else{
            loadMyTodos(text);
        }
    }else{
        loadMyTodos();
    }
    
}



loadMyTodos();

$("#txtSearch").val("");

