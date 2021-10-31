const { gql } = require('apollo-server');

module.exports = gql`
  type Query {
    course(id: ID!): Course
    student(id: ID!): Student
  }

  type Course {
    id: ID!
    name: String!
    students: [Student]
  }

  type Student {
    id: ID
    name: String
    courses: [Course]
  }

  type Mutation {
    createStudent_Addition(
      input: CreateStudent_AdditionRequest!
    ): CreateStudent_AdditionResponse
  }

  input CreateStudent_AdditionRequest {
    course_id: ID!
    student_id: ID!
    year: String
  }
  type CreateStudent_AdditionResponse {
    student_Addition: Student_Addition
  }

  type Student_Addition {
    id: ID
    course_id: String
    student_id: String
    year: String
  }
`;
