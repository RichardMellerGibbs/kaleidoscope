const sortTasks = (tasksToSort, taskData) => {
  const sortableColumnItems = tasksToSort.map(colItem => ({
    title: taskData[colItem].title,
    colId: colItem
  }));

  const sorted = sortableColumnItems.sort(function(a, b) {
    if (a.title === b.title) {
      return 0;
    } else if (a.title > b.title) {
      return 1;
    } else {
      return -1;
    }
  });

  const sortedStartTasks = sorted.map(colId => colId.colId);
  return sortedStartTasks;
};

export default sortTasks;
