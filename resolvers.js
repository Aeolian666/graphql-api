const fetch = require('node-fetch');

const API_URL = 'http://localhost:4000/v1';

const Query = {
  async course(parent, args, context, info) {
    const { id } = args;
    const response = await fetch(`${API_URL}/course/${id}`);
    const body = await response.json();
    return body;
  },

  // using one-line arrow function syntax here plus destructuring inline
  student: async (_, { id }) =>
    fetch(`${API_URL}/student/${id}`).then((res) => res.json()),
};

const Course = {
  async students(parent, args, context, info) {
    const { id } = parent;
    const url = `${API_URL}/term/course/${id}`;

    const terms = await fetch(url).then((res) => res.json());
    console.log(terms); // observe the shape of the return value

    // GOAL: we want to iterate through the list of terms and use the `student_id` to do a
    //  GET /students/student_id call, and build our array of students that the course has seen

    // since this fetch returns a promise, we end up with an array of Student Promises.
    // const arrayOfStudentPromises = terms.map((v) =>
    //   fetch(`${API_URL}/student/${v.student_id}`).then((res) => res.json())
    // );

    const { loaders } = context;
    const arrayOfStudentPromises = terms.map((v) =>
      loaders.studentLoader.load(v.student_id)
    );

    // use `Promise.all` to wait for all those promises to resolve
    // each promise returns the student information, so we end up with an array of students
    const students = await Promise.all(arrayOfStudentPromises);

    // return the final list of students
    return students;
  },
};
// we're adding a new resolver for Student
const Student = {
  courses: async ({ id }) => {
    const terms = await fetch(`${API_URL}/term/student/${id}`).then((res) =>
      res.json()
    );

    return Promise.all(
      terms.map(({ course_id }) =>
        fetch(`${API_URL}/course/${course_id}`).then((res) => res.json())
      )
    );
  },
};

let mockStudent_AdditionsDb = [];

const Mutation = {
  createStudent_Addition: (parent, args, context, info) => {
    const { input } = args;
    const { course_id, student_id, date } = input;

    // Create and save the new Student_Addition model to our "database"
    const student_AdditionRecord = {
      id: mockStudent_AdditionsDb.length,
      course_id,
      student_id,
      date,
    };

    mockStudent_AdditionsDb.push(student_AdditionRecord);

    // Return the new student_Addition
    return {
      student_Addition: student_AdditionRecord,
    };
  },
};

module.exports = {
  Query,
  Course,
  Student,
  Mutation,
};
