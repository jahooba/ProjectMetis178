export const recommendedCoursePlan = [
   {
      "year": 1, 
      "plan": [{
         "quarter": "fall", 
         "courses": [{
            "type": "&&",
            "courses": [
               {"courseID": "CS 010A", "form": "major"},
               {"courseID": "ENGL 001A", "form": "general"},
               {"courseID": "ENGR 001I", "form": "major"},
               {"courseID": "MATH 009A", "form": "major"}
               ]
            }]
         },
         {
            "quarter": "winter", 
            "courses": [{
               "type": "&&",
               "courses": [
                  {"courseID": "CS 010B", "form": "major"},
                  {"courseID": "ENGL 001B", "form": "general"},
                  {"courseID": "MATH 009B", "form": "major"},
                  {"type": "||",
                     "courses" : [
                     {"courseID": "CS 011", "form": "major"},
                     {"courseID": "MATH 011", "form": "major"}
                     ]
                  }
               ]
            }]
         },
         {
            "quarter": "spring", 
            "courses": [{
               "type": "&&",
               "courses": [
                  {"courseID": "CS 010C", "form": "major"},
                  {"courseID": "MATH 009C", "form": "major"},
                  {"form": "breadth"}
               ]
            }]
         },
      ]
   },
   {
      "year": 2, 
      "plan": [{
         "quarter": "fall", 
         "courses": [{
               "type": "&&",
               "courses": [
                  {"courseID": "CS 100", "form": "major"},
                  {"courseID": "PHYS 040A", "form": "major"},
                  {"courseID": "MATH 010A", "form": "major"},
                  {"type": "||",
                     "courses" : [
                     {"courseID": "MATH 031", "form": "major"},
                     {"courseID": "EE 020B", "form": "major"}
                     ]
                  }
               ]
            }]
         },
         {
            "quarter": "winter", 
            "courses": [{
               "type": "&&",
               "courses": [
                  {"courseID": "CS 061", "form": "major"},
                  {"courseID": "CS 111", "form": "major"},
                  {"courseID": "PHYS 040B", "form": "major"},
                  {"form": "breadth"}
               ]
            }]
         },
         {
            "quarter": "spring", 
            "courses": [{
               "type": "&&",
               "courses": [
                  {"courseID": "STAT 155", "form": "major"},
                  {"courseID": "PHYS 040C", "form": "major"},
                  {"type": "||",
                     "courses" : [
                     {"courseID": "EE 120A", "form": "major"},
                     {"courseID": "CS 120A", "form": "major"}
                     ]
                  },
                  {"form": "breadth"}
               ]
            }]
         },
      ]
   },
   {
      "year": 3, 
      "plan": [{
         "quarter": "fall", 
         "courses": [{
            "type": "&&",
            "courses": [
               {"courseID": "CS 141", "form": "major"},
               {"courseID": "CS 150", "form": "major"},
               {"form": "TE"},
               {"form": "breadth"}
               ]
            }]
         },
         {
            "quarter": "winter", 
            "courses": [{
               "type": "&&",
               "courses": [
                  {"courseID": "CS 161", "form": "major"},
                  {"courseID": "CS 152", "form": "major"},
                  {"courseID": "ENGR 101I", "form": "major"},
                  {"form": "TE"}
               ]
            }]
         },
         {
            "quarter": "spring", 
            "courses": [{
               "type": "&&",
               "courses": [
                  {"courseID": "CS 153", "form": "major"},
                  {"courseID": "ENGR 180W", "form": "major"},
                  {"form": "breadth"},
                  {"form": "TE"}
               ]
            }]
         },
      ]
   },
   {
      "year": 4, 
      "plan": [{
         "quarter": "fall", 
         "courses": [{
            "type": "&&",
            "courses": [
               {"form": "project"},
               {"form": "TE"},
               {"form": "TE"},
               {"form": "breadth"}
               ]
            }]
         },
         {
            "quarter": "winter", 
            "courses": [{
               "type": "&&",
               "courses": [
                  {"form": "TE"},
                  {"form": "TE"},
                  {"form": "depth"},
                  {"form": "breadth"}
               ]
            }]
         },
         {
            "quarter": "spring", 
            "courses": [{
               "type": "&&",
               "courses": [
                  {"form": "TE"},
                  {"form": "TE"},
                  {"form": "breadth"}
               ]
            }]
         },
      ]
   },
 ];