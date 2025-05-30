const mockingoose = require('mockingoose');
const Course = require('../model/courseModel');

const {
    fetchCourses,
    fetchCourse,
    createCourse
} = require('./courseModel');

describe('Courses test', ()=> {
    describe('fetchCourses', ()=> {
        it ('should return list of courses', async ()=> {
            mockingoose(Course).toReturn([
                {
                    courseID: "MATH 003",
                    title: "College Mathematics Fundamentals and Problem Solving",
                    units: 3,
                    labHrs: 3,
                    studyHrs: 3,
                    description: "A score on the Mathematics Advisory Examination, as determined by the Mathematics Department; restricted to freshman or an approved summer session enrollment; or consent of instructor. Prepares for success in a college-level mathematics course. Focuses on conceptual and problem solving. Emphasizes practicing symbolic reasoning, evaluating expressions, the meaning of quantities, variables, expressions, formulas, changes in quantities, inequalities, systems of equations, and functions (linear, exponential, logarithmic, quadratic, polynomial, rational, radical). Workload credit only; Graded Satisfactory (S) or No Credit (NC).",
                    PREREQS: [],
                    flatPrereqs: []
                },
                {
                    courseID: "MATH 004",
                    title: "Introduction to College Mathematics For Business and the Social Sciences",
                    units: 5,
                    lectHrs: 5,
                    PREREQS: [{
                        type: "&&",
                        courses: [{
                            type: "||",
                            courses: [{
                                _id: "MATH 003"
                            },
                            {
                                _id: "MATH 004L"
                            }
                        ]
                        }]
                    }],
                    description: "The Mathematics Department determines the study program pathway based upon the score on the Mathematics Advisory Examination; or a score of 2 on the AP Calculus AB Exam; not open to students in the Bourns College of Engineering or the College of Natural and Agricultural Sciences or to students majoring in Economics or Business Economics. Covers functions and their graphs including linear and polynomial functions, zeroes, and inverse functions as well as exponential and logarithmic functions and their inverses. Also includes counting including elementary probability. Involves applications to business and social sciences. Credit is awarded for one of the following MATH 004, MATH 005A, MATH 006A, or MATH 006B.",
                    flatPrereqs: ["MATH 003", "MATH 004L"] 
                }
            ], 'find');
            const results = await fetchCourses();
            expect(results[0].courseID).toBe("MATH 003");
        });
    });
});