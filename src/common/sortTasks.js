const sortTasks = (tasksToSort, taskData) => {
  const sortableTasks = tasksToSort.map(taskId => ({
    surnameFirstname: taskData[taskId].surname + taskData[taskId].forename,
    taskId: taskId
  }));

  //   sortableTasks.forEach(st => {
  //     console.log(`taskId = ${st.taskId} name = ${st.surnameFirstname}`);
  //   });
  //   console.log(`break`);

  const sorted = sortableTasks.sort(function(a, b) {
    if (a.surnameFirstname === b.surnameFirstname) {
      return 0;
    } else if (a.surnameFirstname > b.surnameFirstname) {
      return 1;
    } else {
      return -1;
    }
  });

  //   sorted.forEach(st => {
  //     console.log(`sorted taskId = ${st.taskId} name = ${st.surnameFirstname}`);
  //   });

  const sortedStartTasks = sorted.map(taskId => taskId.taskId);
  return sortedStartTasks;
};

export default sortTasks;
