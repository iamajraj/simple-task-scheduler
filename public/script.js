$(document).ready(function () {
  const taskForm = $('#task-form');
  const taskList = $('#task-list');

  loadTasks();

  taskForm.submit(function (e) {
    e.preventDefault();

    const taskTime = $('#taskTime').val();
    const taskDescription = $('#taskDescription').val();
    const taskAlarm = $('#taskAlarm').is(':checked');

    addTaskToDatabase(taskTime, taskDescription, taskAlarm);
    taskForm[0].reset();
    taskList.empty();
    loadTasks();
  });

  function addTaskToDatabase(time, description, alarm) {
    const taskData = {
      time: time,
      description: description,
      alarm: alarm,
    };

    $.ajax({
      url: '/addTask',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(taskData),
      success: function (response) {
        console.log(response);
      },
    });
  }

  function loadTasks() {
    $.get('/getTasks', function (tasks) {
      tasks.forEach((task) => {
        console.log(task);
        addTask(task.time, task.description, task.alarm, task.id);
      });
    });
  }

  function addTask(time, description, alarm, id) {
    const formattedTime = new Date(time).toLocaleString();
    const newTask = `
          <li data-id="${id}" class="task-item">
              <span class="task-time">${formattedTime}</span>
              <span class="task-description">${description}</span>
              ${alarm ? '<span class="task-alarm">🔔</span>' : ''}
              <span class="task-delete">❌</span>
          </li>
      `;
    taskList.append(newTask);
  }

  function deleteTask(id) {
    $.ajax({
      url: `/deleteTask/${id}`,
      method: 'DELETE',
      success: function (response) {
        console.log(response);
      },
    });
  }

  taskList.on('click', '.task-delete', function () {
    const taskItem = $(this).closest('li');
    const taskId = taskItem.data('id');
    deleteTask(taskId);
    taskItem.remove();
  });

  function checkAlarms() {
    const now = new Date();
    $('.task-time').each(function () {
      const taskTime = new Date($(this).text());
      const alarmEnabled = $(this).siblings('.task-alarm').length > 0;
      if (taskTime > now && taskTime - now <= 1000 && alarmEnabled) {
        startAlarm();
      }
    });
  }

  // Check for alarms every second
  setInterval(checkAlarms, 1000);
});

function startAlarm() {
  //!!! TASK: Play an alarm sound, show a notification
  // For simplicity, I'll just use an alert here.
  alert('Alarm!');
}
