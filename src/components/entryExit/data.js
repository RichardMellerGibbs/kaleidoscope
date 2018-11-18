const initialData = {
  tasks: {
    J18345: { id: 'J18345', surname: 'Gibbs' },
    R13345: { id: 'R13345', surname: 'Bentford' },
    K15675: { id: 'K15675', surname: 'Miller' },
    L1348345: { id: 'L1348345', surname: 'James' },
    S3344: { id: 'S3344', surname: 'Fenby' },
    A334455: { id: 'A334455', surname: 'Peterson' },
    U778867: { id: 'U778867', surname: 'Hooper' },
    S34112: { id: 'S34112', surname: 'Lily' }
  },
  columns: {
    checkedIn: {
      id: 'checkedIn',
      title: 'Checked In',
      taskIds: ['J18345', 'R13345', 'K15675', 'L1348345']
    },
    checkedOut: {
      id: 'checkedOut',
      title: 'Checked Out',
      taskIds: ['S3344', 'A334455', 'U778867', 'S34112']
    }
  },
  columnOrder: ['checkedIn', 'checkedOut']
};

export default initialData;
