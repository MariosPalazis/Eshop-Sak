const deleteElements = document.querySelectorAll(".delete-operation");
const editElements = document.querySelectorAll(".edit");
const addElements = document.querySelectorAll(".add");
const commitChangesButton = document.getElementById("commit");
let productID = document.querySelector(".product-container");
productID = productID.classList[1];

// switches to be passed to the toggleCommit function
const OFF = false;
const ON = true;

// stack where new rows are pushed are pushed
let newRows = [];

for (const element of deleteElements) {
  element.addEventListener("click", deleteThis);
}

for (const element of editElements) {
  element.addEventListener("click", editThis);
}

for (const element of addElements) {
  element.addEventListener("click", addThis);
}

// on click, send the whole updates stack to the server
commitChangesButton.addEventListener("click", commitUpdates);

function toggleCommit(handle) {

  if (handle) {
    commitChangesButton.addEventListener("click", commitUpdates);
  } else {
    commitChangesButton.removeEventListener("click", commitUpdates);
  }
}

function refreshInputs(row) {
  let regexp = /unit/;
  for (const cell of row.children) {
    if (!regexp.test(cell.className) && cell.className !== "add") {
      cell.firstChild.value = "";
      cell.firstChild.disabled = true;
    }
  }
}

function addThis() {
  // remove the disabled property from the anchors inside each cell, inside the table row
  // turn the add new product button into  a done button
  // when the user is done adding the table row
  // turn the table row into an edit one, meaning that an edit-img must be added
  // and the garbage-bin img must be added.

  // get the parent row of the table cell
  let parentRow = this.parentElement;
  // get the children of the parentRow element
  let children = parentRow.children;

  let tableClass = parentRow.parentElement.parentElement.getAttribute("id");
  // mark the tbody of the table as needed to be updated, since a change has occured
  parentRow.parentElement.parentElement.classList.add("changed");

  // turn of the disabled attribute from each anchor.
  // keep the disabled attribute on the units cells
  let regexp = new RegExp('.*unit');
  for (let i = 0; i < children.length - 1; ++i) {
    if (regexp.test(children[i].className)) continue;
    children[i].firstChild.disabled = false;
  }

  // children[i].length = the last table cell of the row, which holds the index
  // of the rows that correspond with those of the database

  // turn the add new product button into a done button
  if (parentRow.classList.contains("add")) {
    // get the contents of all the inputs
    let childrenText = [];
    for (let i = 0; i < children.length - 1; ++i) {
      // make sure that all cells have been provided with a value
      // otherwise alert and quit the proccess;
      if (!children[i].firstChild.value) {
        alert("provide values for all cells");
        return;
      }
      childrenText.push(children[i].firstChild.value)
    }

    // make sure the "to" column has a smaller number than the "from" column
    if (tableClass === "wheelDiameter" || tableClass === "thickness") {
      // make sure the "to" column has a smaller number than the "from" column
      if (childrenText[0] > childrenText[1]) {
        children[0].firstChild.classList.add("delete");
        children[1].firstChild.classList.add("delete");
        alert("the 'to' column has a smaller number than the 'from' column, not allowed!");
        return;
      } else {
        children[0].firstChild.classList.remove("delete");
        children[1].firstChild.classList.remove("delete");
      }
    }

    tableCellContentSwitch(children[children.length -1], "add");
    createNewTableRow(parentRow, childrenText);
    parentRow.classList.remove("add");
    refreshInputs(parentRow);
    toggleCommit(ON);
  } else {
    toggleCommit(OFF);
    parentRow.classList.add("add");
    tableCellContentSwitch(children[children.length -1], "add");
  }
}

function deleteThis() {
  // get the parent row of the table cell
  let parentRow = this.parentElement;

  // get the children of the parentRow element
  let children = parentRow.children;

  // mark the table as needed to be updated, since a change has occured
  parentRow.parentElement.parentElement.classList.add("changed");


  // remove the editThis event listener from the table cell of this row
  // so that race conditions can be avoided. If the administrator wants
  // to edit again the delete class must be removed from the table row
  children[children.length -3].removeEventListener("click", editThis);

  if (parentRow.classList.contains("delete")) {
    parentRow.classList.remove("delete");

    tableCellContentSwitch(children[children.length -2], "delete");


    // register again the event listener again, since the administrator
    // has choosen to cancel the deletion operation.
    children[children.length -3].addEventListener("click", editThis);


  } else {
    parentRow.classList.add("delete");

    tableCellContentSwitch(children[children.length -2], "delete");

  }

}

function editThis() {
  // get the parent row of the table cell
  let parentRow = this.parentElement;


  // get the children of the parentRow element
  let children = parentRow.children;

  // mark the tbody of the table as needed to be updated, since a change has occured
  parentRow.parentElement.parentElement.classList.add("changed");


  // get the class of the table
  let tableClass = parentRow.parentElement.parentElement.getAttribute("id");

  // remove the deleteThis event listener from the table row currently being
  // updates so as to remove any race conditions, after the current row
  // has been updated the event Listener is registered again
  children[children.length -2].removeEventListener("click", deleteThis);


  // get the content of the children of the parentRow except the last two
  // which hold the edit and delete icons
  let childrenText = [];
  for (let i = 0; i < children.length - 3; ++i) {
    childrenText.push(children[i].innerText);
  }

  
  // if its the first time that is clicked remove the class edit
  // thus allowing to alter the effects of a second click
  if (parentRow.classList.contains("edit")) {

    for (let i = 0; i < children.length -3; ++i) {
      childrenText[i] = children[i].children[0].value;
    }


    if (tableClass === "wheelDiameter" || tableClass === "thickness") {
      // make sure the "to" column has a smaller number than the "from" column
      if (parseInt(childrenText[0]) > parseInt(childrenText[1])) {
        children[0].firstChild.classList.add("delete");
        children[1].firstChild.classList.add("delete");
        alert("the 'to' column has a smaller number than the 'from' column, not allowed!");
        return;
      } else {
        children[0].firstChild.classList.remove("delete");
        children[1].firstChild.classList.remove("delete");
      }
    }

    // turn the table cell with class edit from a done button to the edit icon
    tableCellContentSwitch(children[children.length -3], "update");

    // get the contents of each input form and have them replace
    // the contents of the childrenText array.
    // then remove the input from each table cell
    for (let i = 0; i < children.length -3; ++i) {
      // children[i].children[0] == <input> element inside each table cell
      // remove the input
      children[i].children[0].remove();

      // append the new text
      children[i].innerText = childrenText[i];

    }

    // register again the event listener for the updated table row
    children[children.length -2].addEventListener("click", deleteThis);

    parentRow.classList.remove("edit");


    toggleCommit(ON);
  } else {
    toggleCommit(OFF);
    parentRow.classList.add("edit");

    // remove the inner Text of each table cell
    // and then call the createInputNodes function which
    // creates an input node for each table cell, then append it
    // to each table cell, each input get the value of each cell,
    // and the class of each table cell because the inputs name
    for (let i = 0; i < children.length - 3; ++i) {
      children[i].innerText = "";
      children[i].appendChild(createInputNodes(children[i], childrenText[i]));
    }

    // turn the table cell with class edit from an edit icon to a done button
    tableCellContentSwitch(children[children.length -3], "update");
  }

  // finally add a class to the table row signifying that this table row has been edited
  if (parentRow.classList.contains("edited")) {
  } else {
    if (parentRow.classList.contains("new")) {
      parentRow.classList.add("new-edited")
    } else {
      parentRow.classList.add("edited");
    }
  }
}



// given a parentRow and some tableCellContent
// this function will add a new table row
// with each table cell filled with the content provided.
// this function is invoked by the addThis function to
function createNewTableRow(parentRow, newContent) {

  // get the table parent of the parentrow
  let table = parentRow.parentElement.parentElement;

  // get the db class
  let dbPropertyName = table.getAttribute("id");

  // the add new product table row is the last node in the tbdoy element
  // the new row after being constructed should be added before that
  let tbodyLength = parentRow.parentElement.children.length;

  // get the index of the last database corresponding table row
  let index = parentRow.parentElement.children;
  index = index[index.length - 2];
  index = index.children[index.children.length - 1].innerText;

  // get the number of rows that correspond with the table rows of the database
  let newRow = table.insertRow(tbodyLength -1);

  let newCell;
  for (let i = 0; i < newContent.length; ++i) {
    newCell = newRow.insertCell(i);
    newCell.innerText = newContent[i];
  }


  let deleteImg = document.createElement("IMG");
  deleteImg.setAttribute("src", "/assets/smalls/delete_garbage_bin.svg");
  deleteImg.setAttribute("alt", "edit-icon");
  deleteImg.style.width = "20";
  deleteImg.style.height = "20";

  newCell = newRow.insertCell(newContent.length);
  newCell.style.width = "20px";
  newCell.style.height = "20px";
  newCell = newRow.insertCell(newContent.length + 1);
  newCell.setAttribute("colspan", 2);
  newCell.classList.add("delete-operation");
  newCell.appendChild(deleteImg);
  // event listeners must be added to the delete and edit icons because
  // the script would have already run when the event listeners were registered
  newCell.addEventListener("click", deleteThis);

  // last table cell is filled with the new parent rows index;
  newCell = newRow.insertCell(newContent.length + 2);
  newCell.classList.add("index");
  newCell.innerText = ++index;

  // the new table row is given a class of new which will paint it green
  newRow.classList.add("new");
  newRow.classList.add(dbPropertyName);

  // add the new row to the stack
  stockNew(newRow, index);
}


// given a node element with a class and some text
// it creates an input element with name == class
// and value === text
// node = the table cell
// text = the text of the table cell
function createInputNodes(node, text) {
  let input = document.createElement("INPUT");
  input.setAttribute("type", "text");
  input.setAttribute("name", node.className);
  input.setAttribute("value", text);

  // make sure that the units cannot be altered with
  let regexp = new RegExp('.*unit');
  if (regexp.test(node.className)) input.disabled = true;

  return input;
}

// switches the content of a table cell content with class Edit
// from an img element to a button element with content done
function tableCellContentSwitch(cell, operation) {

  let done = document.createElement("BUTTON");
  done.innerHTML = "done";

  let editImg = document.createElement("IMG");
  editImg.setAttribute("src", "/assets/smalls/edit_pencil_icon.svg");
  editImg.setAttribute("alt", "edit-icon");
  editImg.style.width = "20";
  editImg.style.height = "20";

  let cancel = document.createElement("BUTTON");
  cancel.innerHTML = "cancel";

  let deleteImg = document.createElement("IMG");
  deleteImg.setAttribute("src", "/assets/smalls/delete_garbage_bin.svg");
  deleteImg.setAttribute("alt", "edit-icon");
  deleteImg.style.width = "20";
  deleteImg.style.height = "20";

  let add = document.createElement("BUTTON");
  add.setAttribute("colspan", "2");
  add.innerHTML = "Add new product";

  switch (operation) {
  case "update":
    if (cell.classList.contains("edit")) {
      cell.classList.remove("edit");
      cell.children[0].remove();
      cell.appendChild(done);
    } else {
      cell.classList.add("edit");
      cell.children[0].remove();
      cell.appendChild(editImg);
    }
    break;
  case "delete":
    if (cell.classList.contains("delete-operation")) {
      cell.classList.remove("delete-operation");
      cell.children[0].remove();
      cell.appendChild(cancel);
    } else {
      cell.classList.add("delete-operation");
      cell.children[0].remove();
      cell.appendChild(deleteImg)
    }
    break;
  case "add":
    if (cell.classList.contains("add")) {
      done.setAttribute("colspan", "2");
      cell.classList.remove("add");
      cell.children[0].remove();
      cell.appendChild(done);
    } else {
      cell.classList.add("add");
      cell.children[0].remove();
      cell.appendChild(add);
    }
    break;
  default:
    alert("wrong type of operation was provided to the tableCellContentSwitch function");
    break;
  }

}

function stockNew(tableRow, index) {
  let dbPropertyName = tableRow.parentElement.parentElement.getAttribute("id");

  let data = {
    dbPropertyName: dbPropertyName,
    index: index,
    operation: "add",
    row: tableRow,
  }

  newRows.push(data);
}

// sends the whole updates stack to the server
function commitUpdates() {
  // gather all the tables that have been altered
  let tables = document.querySelectorAll(".changed");
  // if none of them has exit the function effectively doing nothing
  if (!tables.length) return;
  // else prepare the data for sending
  prepareData(tables);


  // fetch("/admin/products/add", {
  //   method: "POST",
  //   headers: { "Content-type": "application/json" },
  //   body: JSON.stringify(data),
  // }).then(response => {
  //   return response.text();
  // }).then(data => {
  //   alert(data);
  // }).catch(err => {
  //   alert(err);
  // })
}

// This functions purpose is to gather all the rows
// and then apply the changes that have been kept in
// the newRows data structure
function prepareData(tables) {
    // get the id's of each table and add the row string
  let tableIds = [];
  for (const table of tables) {
    tableIds.push({
      tableClass: table.getAttribute("id"),
      rowClass: table.getAttribute("id") + "-row",
    })
  }

  // get the row for each table
  for (const table of tableIds) {
    table.rows = Array.from(document.querySelectorAll("." + table.rowClass));
  }


  // check if there have been any new rows added to any table
  if (newRows.length) {
    for (const table of tableIds) {
      for (const newRow of newRows) {
        // insert the newly constructed row to its appropriate table
        if (newRow.dbPropertyName === table.tableClass) table.rows.push(newRow.row);
      }
    }
  }

  // shorting the array to ascending order
  bubbleShort(tableIds);

  // transform the table rows into the format the database expects
  for (const table of tableIds) {
    for (let i = 0; i < table.rows.length; ++i) {
      //  remove deleted items
      if (table.rows[i].classList.contains("delete")) {
        table.rows.splice(i, 1);
        // -i happens when an item is removed, if not one row shall not be converted
        --i;

      } else { // change the format
        table.rows[i] = changeFormat(table.rows[i], table.tableClass);
      }
    }
  }

  for (const table of tableIds) {
    for (const row of table.rows) {
      console.log(row);
    }
  }

}

function bubbleShort(changedTables) {
  let tmp = {};
  for (const table of changedTables) {
    if (table.tableClass === "wheelDiameter") {
      for (let i = 0; i < table.rows.length; ++i) {
        for (let j = 0; j < table.rows.length - 1; ++j) {
          // 0 = from
          // 1 = to
          // so if the next row is less than the previous one swap them
          if (parseInt(table.rows[j].children[0].innerText) > parseInt(table.rows[j + 1].children[0].innerText)) {
            tmp = table.rows[j];
            table.rows[j] = table.rows[j + 1];
            table.rows[j + 1] = tmp;
          }
        }
      }
    } else if (table.tableClass === "thickness") {
    } else {
      return;
    }
  }
}

function changeFormat(row, typeOfRow) {

  let formatedRow = {};
  let cells = row.children;
  switch (typeOfRow) {
  case "wheelDiameter":
    // range of cells of interest: 0 - 5
    formatedRow = {
      amount: {
        from: cells[0].innerText,
        to: cells[1].innerText,
      },
      unit: cells[2].innerText,
      price: cells[3].innerText,
      priceUnit: cells[4].innerText,
      stock: cells[5].innerText,
    };
    break;
  case "thickness":
    // range of cells of interest: 0 - 4
    formatedRow = {
      amount: cells[0].innerText,
      unit: cells[1].innerText,
      price: cells[2].innerText,
      priceUnit: cells[3].innerText,
      stock: cells[4].innerText,
    };
    break;
  case "leatherColor":
    // range of cells of interest: 0 - 3
    formatedRow = {
      color: cells[0].innerText,
      price: cells[1].innerText,
      priceUnit: cells[2].innerText,
      stock: cells[3].innerText,
    };
    break;
  case "threadColor":
    // range of cells of interest: 0 - 3
    formatedRow = {
      color: cells[0].innerText,
      price: cells[1].innerText,
      priceUnit: cells[2].innerText,
      stock: cells[3].innerText,
    };
    break;
  case "spokes":
    // range of cells of interest: 0 - 5
    formatedRow = {
      description: cells[0].innerText,
      amount: cells[1].innerText,
      unit: cells[2].innerText,
      price: cells[3].innerText,
      priceUnit: cells[4].innerText,
      stock: cells[5].innerText,
    };
    break;
  case "colorOfSpokes":
    // range of cells of interest: 0 - 3
    formatedRow = {
      color: cells[0].innerText,
      price: cells[1].innerText,
      priceUnit: cells[2].innerText,
      stock: cells[3].innerText,
    };
    break;
  default:
    alert("error contact developer");
    return;
  }
  return formatedRow;
}
