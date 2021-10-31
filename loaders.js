const DataLoader = require('dataloader');
const fetch = require('node-fetch');

const {API_URL} = process.env; //'http://localhost:4000/v1';

const studentLoader = new DataLoader((ids) => {
  const arrayOfStudentPromises = ids.map((id) => {
    console.log(`Calling for student: ${id}`);
    return fetch(`${API_URL}/student/${id}`).then((res) => res.json());
  });
  return Promise.all(arrayOfStudentPromises);
});

module.exports = {
  getDataLoaders: () => ({
    studentLoader: studentLoader,
  }),
};
