
//just overall class data
//create a db for requirements
export const data = [

    {
        courseID:"MATH 003",
        description: 
        "A score on the Mathematics Advisory Examination, as determined by the Mathematics Department; restricted to freshman or an approved summer session enrollment; or consent of instructor. Prepares for success in a college-level mathematics course. Focuses on conceptual and problem solving. Emphasizes practicing symbolic reasoning, evaluating expressions, the meaning of quantities, variables, expressions, formulas, changes in quantities, inequalities, systems of equations, and functions (linear, exponential, logarithmic, quadratic, polynomial, rational, radical). Workload credit only; Graded Satisfactory (S) or No Credit (NC).",
        labHrs:3,
        studyHrs: 3,
        "title":"College Mathematics Fundamentals and Problem Solving",
        units: 3
    },

    {
        courseID:"MATH 004",
        description: 
        "The Mathematics Department determines the study program pathway based upon the score on the Mathematics Advisory Examination; or a score of 2 on the AP Calculus AB Exam; not open to students in the Bourns College of Engineering or the College of Natural and Agricultural Sciences or to students majoring in Economics or Business Economics. Covers functions and their graphs including linear and polynomial functions, zeroes, and inverse functions as well as exponential and logarithmic functions and their inverses. Also includes counting including elementary probability. Involves applications to business and social sciences. Credit is awarded for one of the following MATH 004, MATH 005A, MATH 006A, or MATH 006B.",
        labHrs:3,
        studyHrs: 5,
        title: "Introduction to College Mathematics For Business and the Social Sciences",
        units: 5
    }
]

//can be the format for requirements of each major
export const requirements = [
    {
        lowerDivs: [ 
            "ENGR 001-I", "CS 010A", "CS 010B", "CS 010C", "CS 061", "CS 011/MATH 011", 
            "MATH 009A, MATH 009B, MATH 009C,MATH 010A, and either Math 031 or EE 020B", 
            "PHYS 040A", "PHYS 040B", "PHYS 040C", 
            "8+ units in BIEN010, EE030A & 30LA, EE 005, EE 016, EE20A, ENSC 001, ENSC 002, MATH 010B, MATH 046, ME 002, ME 005, ME 018A, ME 018B, ME 009, ME 010 "
        ],
        lowerDivUnits: 65,
        upperDivUnits: 79,
        upperDivs: [{
            req: 'a',
            type: "&&",
            courses:[{
                    courseID:"ENGR 101-I"
                }],
            },
            {
            req:'b',
            type: "&&",
            courses: [{
                    courseID:"CS 100",
                },
                { 
                    courseID: "CS 141",
                },
                {
                    courseID: "CS 150",
                },
                {
                    courseID: "CS 152",
                },
                {
                    courseID: "CS 153",
                },
                {
                    courseID: "CS 161",
                },
                {
                    type: "||",
                    courses: [{
                        courseID: "CS 179E",
                    },
                    {
                        courseID: "CS 179F"
                    },
                    {
                        courseID: "CS 179G"
                    },
                    {
                        courseID: "CS 179I"
                    },
                    {
                        courseID: "CS 179J"
                    },
                    {
                        courseID: "CS 179K"
                    },
                    {
                        courseID: "CS 179M"
                    },
                    {
                        courseID: "CS 179N"
                    },
                    {
                        type: "&&",
                        courses: [{
                            courseID: "CS 178A"
                        },
                        {
                            courseID: "CS 178B"
                        }],
                    }],
                }],
            },
            {
            req: "c",
            type: "||",
            courses:[{
                    courseID: "CS 120A",
                },
                {
                    courseID: "EE 120A",
                }],
            },
            {
            req: "d",
            courses: [{
                courseID:"CS 111"
                }]
            },
            {
            req: "e",
            courses: [{
                courseID:"ENGR 180W"
            }]
            }, 
            {
            req:"f",
            courses: [{
                courseID:"STAT 155"
            }],
            },
            {
            req: "g",
            type: "||" [{
                units: 32,
                courses: [{
                        courseID: "CS 105",
                        maxUnits: "N/a"
                    },
                    { 
                        courseID: "CS 108",

                    },
                    {
                        courseID: "CS 110"
                    },
                     "CS 120B/EE 120B", "CS 122A", "CS 122B", "CS 130", "CS 131", "CS 133", "CS 135",
                    "CS 142", "CS 144", "CS 145", "CS 147", "CS 160", "CS 162", "CS 164", "CS 165", "CS 166", "CS 167", "CS/EE 168",
                    "CS 169", "CS 170", "CS 171", "CS 172", "CS 173", "CS 175", "CS 177", "CS 178B", "CS 179 (E-Z) (4 units maximum)",
                    "CS 180", "CS 181", "CS 182", "CS 183", "CS 193 (4 units maximum)", "MATH 120", "MATH 126", "MATH 135A", "MATH 135B",
                    "PHIL 124"
                }],
                info: "The technical electives selected must be distinct from those used to satisfy the requirements specified in 2.a)–f) above, with at least half of the (16) units selected from Computer Science courses",
            }],
        },
    }
]