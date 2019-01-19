const sortUsers = userList => {
  //   console.log("userList ", userList);

  //   console.log("name ", userList[0].name.split(" ")[0]);

  const sortableUsers = userList.map(user => ({
    fullname: user.name.split(" ")[1] + user.name.split(" ")[0],
    reference: user.reference,
    status: user.status,
    name: user.name,
    spools: user.spools,
    active: user.active
  }));

  //console.log("sortableUsers ", sortableUsers);

  const sorted = sortableUsers.sort(function(a, b) {
    if (a.fullname === b.fullname) {
      return 0;
    } else if (a.fullname > b.fullname) {
      return 1;
    } else {
      return -1;
    }
  });

  const sortedUsers = sorted.map(user => ({
    status: user.status,
    name: user.name,
    reference: user.reference,
    spools: user.spools,
    active: user.active
  }));

  //console.log("sortedUsers ", sortedUsers);

  return sortedUsers;
};

export default sortUsers;
