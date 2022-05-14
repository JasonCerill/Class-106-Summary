const iconImportant = "iImportant fas fa-star";
const iconNonImportant = "iImportant far fa-star";
var important = false;
var panelVisible = true;
var total = 0;

function toggleImportance() {
  if (important) {
    $("#iImportant").removeClass(iconImportant).addClass(iconNonImportant);
    important = false;
    //from important to nonImportant
  } else {
    $("#iImportant").removeClass(iconNonImportant).addClass(iconImportant); //nonImportant to important
  }
}

function togglePanel() {
  if (panelVisible) {
    $("#form").hide();
    $("#btnTogglePanel").text("< Show");
    panelVisible = false;
  } else {
    $("#form").show();
    $("#btnTogglePanel").text("Hide >");
    panelVisible = true;
  }
}

function saveTask() {
  let taskName = $("#txtTaskName").val();
  let descrip = $("#txtDescrip").val();
  let dueDate = $("#selDueDate").val();
  let location = $("#txtLocation").val();
  let invites = $("#txtInvites").val();
  let color = $("#selColor").val();
  let frequency = $("#selFrequency").val();
  let status = $("#selStatus").val();

  let task = new Task(
    important,
    taskName,
    descrip,
    dueDate,
    location,
    invites,
    color,
    frequency,
    status
  );
  console.log(task);
  displayTask(task);
  console.log(JSON.stringify(task));
}

function getStatusText(status) {
  switch (status) {
    case "1":
      return "Pending";
    case "2":
      return "In Progress";
    case "3":
      return "Paused";
    case "4":
      return "Completed";
    case "5":
      return "Abandoned";

    default:
      return "other";
  }
}

function getFrequencyText(val) {
  switch (val) {
    case "0":
      return "One Time";
    case "1":
      return "Daily";
    case "2":
      return "Weekly";
    case "3":
      return "Monthly";

    default:
      return "";
  }
}

function displayTask(task) {
  let syntax = `
   <div class="task-item"> 
    
    <div class="info-1">
      <h4>${task.taskName}</h4>
      <p>${task.description}</p>
    </div>  

    <div class="info-2>
      <label>${task.dueDate}</label>
      <label>${task.location}</label>
    </div>

    <div class="info-3">
      <p>${task.invites}</p>
    </div>

    <div class="info-2">
      <label>${getStatusText(task.status)}</label>
      <label>${task.frequency}</label>




    </div>`;

  $("#tasks").append(syntax);
}

$.ajax({
  type: "post",
  url: "https://fsdiapi.azurewebsites.net/api/tasks/",
  data: JSON.stringify(task),
  contentType: "application/json",
  success: function (res) {
    console.log("Task Saved", res);
    displayTask(task);
    clearFrom();

    total += 1;
    $("#headCount").text("You Have " + total + "Tasks");
  },

  error: function (errorDetails) {
    console.error("Save Failed", errorDetails);
  },
});

function clearForm() {
  $("input").val("");
  $("textarea").val("");
  $("select").val("0");
  $("#selColor").val("#ffffff");
}

function getStatusText(status) {
  switch (status) {
    case "1":
      return "Pending";
    case "2":
      return "In Progress";
  }
}

function fetchTasks() {
  $.ajax({
    type: "get",
    url: "https://fsdiapi.azurewebsites.net/api/tasks",
    success: function (res) {
      let data = JSON.parse(res); //(decode) from string to obj

      for (let i = 0; i < data.length; i++) {
        let task = data[i];

        if (task.name == "Jason") {
          total += 1;
          displayTask(task);
        }
      }
    },
    error: function (err) {
      console.error("Errror Retrieving Data", err);
    },
  });
}

function clearAllTasks() {
  $.ajax({
    type: "delete",
    url: "https://fsdiapi.azurewebsites.net/api/tasks/clear/Jason",
    success: function () {
      location.reload();
    },
    error: function (err) {
      console.log("Error Clearing Task");
    },
  });
}

function init() {
  console.log("Hey");

  //assign events
  $("#iImportant").click(toggleImportance);
  $("#btnTogglePanel").click(togglePanel);
  $("#btnSave").click(saveTask);
  $("#btnClearAll").click(clearAllTasks);

  //load data
  fetchTasks();
}

window.onload = init;
