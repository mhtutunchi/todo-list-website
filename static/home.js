
// Get id of signed in user
var userid = $("#userid").val();

// An extension function for string replaceAll
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

// Alertify framework config
alertify.defaults.transition = "slide";
alertify.defaults.theme.ok = "btn btn-primary";
alertify.defaults.theme.cancel = "btn btn-danger";
alertify.defaults.theme.input = "form-control";


function loadMyTodos(searchText, filter) {
    /*
        a function that is used to clear current content of TODOs table and
        load desired content from server.
        ------------------
        Parameters :
            searchText (Optional) : string
            filter (Optional) : any
        ------------------
        Return type : void
    */
    var apiEndpoint = '/api.php?action=get&userid=' + userid;
    if (!(searchText === undefined || searchText == "")) {
        apiEndpoint += "&search=" + searchText;
    }
    if ((!(filter === undefined)) || $("#filter").is(":checked")) {
        apiEndpoint += "&filter=1";
    }

    // Ajax call to get content
    $.ajax({
        url: apiEndpoint,
        async: true,
        complete: function (response) {

            $("#mytable").html("");


            var jsonData = JSON.parse(response.responseText);

            // Add rows to table
            for (var i = 0; i < jsonData.length; i++) {
                var newRowContent = '<tr>';

                var id = jsonData[i].id;
                var desc = jsonData[i].description;
                var status = String(jsonData[i].status);

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

    /*
        a function that is used to add new TODO from input.
        ------------------
        Parameters : None
        ------------------
        Return type : void
    */

    // Check for todo description text
    var new_desc = document.getElementById("txtNewItem").value;
    if (new_desc.length < 1) {
        alertify.error("Item description connot be empty!");
        return false;
    } else {

        // Ajax call to insert data to database
        $.ajax({
            url: "api.php?action=insert&userid=" + userid + "&desc=" + new_desc,
            complete: function (response) {
                var status = JSON.parse(response.responseText);
                if (status.status == "success") {
                    alertify.success("New item has been added successfully");
                } else if (status.status == "error") {
                    alertify.error("Error while adding the item");
                }
                // reload the table
                loadMyTodos(); 
                document.getElementById("txtNewItem").value = "";
            },
            error: function () {
                alertify.error("Error while connecting from database!");
            },
        });

    }

}



function deleteItem(id) {
    /*
        a function that is used to delete a TODO.
        ------------------
        Parameters : 
            id : int
        ------------------
        Return type : void
    */

    // Confirm...
    alertify.confirm('Delete item', 'Are you sure to delete this item?', function () {
        // Ajax call to delete TODO from database
        $.ajax({
            url: 'api.php?action=delete&id=' + id,
            complete: function (response) {
                var status = JSON.parse(response.responseText);
                if (status.status == "success") {
                    alertify.success("Item Deleted !");
                    // reload the table
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
        , function () { });

}


function editItem(id, desc) {

    /*
        a function that is used to edit a TODO.
        ------------------
        Parameters : 
            id : int
            desc (Current description of selected TODO) : string 
        ------------------
        Return type : void
    */

    // Get new description 
    alertify.prompt("Edit", "New todo description :", desc, function (e, str) {
        if (e) {
            if (str.length > 0) {

                // get status of TODO
                if (document.getElementById('c' + String(id)).checked) {
                    var stat = 1;
                } else {
                    var stat = 0;
                }
                // Ajax call to edit TODO in database
                $.ajax({

                    url: 'api.php?action=edit&id=' + id + "&new_desc=" + str + "&new_status=" + stat,
                    complete: function (response) {
                        var status = JSON.parse(response.responseText); 
                        if (status.status == "success") {
                            alertify.success("Information updated successfully");
                            // reload the table
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


/* an Event Handler for every status CheckBox that belongs to a TODO
   That updates the status of item in Database
*/
$('body').on('change', '.status', function () {

    var tid = parseInt(String(this.id).replace("c", ""));

    if ($(this).is(":checked")) {
        var stat = 1;
    } else {
        var stat = 0;
    }

    // Ajax call for updating status of selected item in database
    $.ajax({
        url: 'api.php?action=edit&id=' + tid + "&new_status=" + stat,
        async: true,
        complete: function (response) {
            var status = JSON.parse(response.responseText);
            if (status.status == "success") {
                alertify.success("Status changed successfully!");

            } else if (status.status == "error") {
                alertify.error("Error while editing the item !");
            }
        },
        error: function () {
            alertify.error("Error while connecting from database!");
        },
    });
});


// an Event Handler for filter checkbox that reloads the database according to the filter
$("#filter").change(function () {
    if (this.checked) {
        loadMyTodos(document.getElementById("txtSearch").value, true)
    }
    else {
        loadMyTodos(document.getElementById("txtSearch").value, undefined)
    }
});


function search(text) {
    /*
        a function that is used reload the table data according to the search keyword and filter
        ------------------
        Parameters : 
            text : string
        ------------------
        Return type : void
    */
    if (text != "") {
        if ($("#filter").is(":checked")) {
            loadMyTodos(text, "1");
        } else {
            loadMyTodos(text);
        }
    } else {
        loadMyTodos();
    }
}

// get the TODOs table at page load
loadMyTodos();

$("#txtSearch").val("");

