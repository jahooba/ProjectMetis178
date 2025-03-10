import { useState } from 'react';
import axios from 'axios'
import * as d3 from 'd3';

const CourseTree = ({ onNodeRightClick, setPrereqData, prereqData, currentUserId, completedCourses }) => {
  const [courseName, setCourseName] = useState('');
  const [courseData, setCourseData] = useState(null);
  //const [prereqData, setPrereqData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCourseData = async () => {
    if (!courseName.trim()) {
      setError("Please enter a course name.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses?name=${encodeURIComponent(courseName)}`, {withCredentials: true});
      
      console.log("API URL:", import.meta.env.VITE_API_URL);
      
      const { PC_course, RG_prereqData } = response.data;
      setCourseData(PC_course);
      setPrereqData(RG_prereqData);
      renderTree(PC_course, RG_prereqData);
    } 
    catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const renderTree = (PC_course, RG_prereqData) => {
    d3.select("#tree").selectAll("*").remove(); // Clear previous visualization

    const width = 1000;
    const height = 600;

    const svg = d3.select("#tree").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(50, 50)");

    const treeLayout = d3.tree().size([height-100, width-200]);
    const root = d3.hierarchy(PC_course, d => d.children || []);
    treeLayout(root);

    let selectedNodes = new Set(completedCourses || []);

    const extractPrereqPaths = (prereq) => {
      let paths = [];
  
      prereq.courses.forEach(course => {
          if (course.type) {
              // Recursively extract nested prerequisite logic
              const nestedPaths = extractPrereqPaths(course);
              paths = paths.concat(nestedPaths);  // Flatten result
          } else {
              // Extract the correct course ID (handle both ObjectIds and strings)
              const courseId = course.prereqName || course.courseID || course.name;
              
              if (courseId) {
                  paths.push(courseId);  // Ensure we're only adding valid course IDs
              }
          }
      });
  
      return paths;
    };
  
  
    const determineLineColor = (d) => {
      const sourceId = d.source.data.name;
      const targetId = d.target.data.name;
      const targetCourse = RG_prereqData.find(course => course.courseID === targetId);
  
      if (!targetCourse || !targetCourse.PREREQS) { 
          console.log(`No prerequisites found for ${targetId}, using default gray`);
          return "#ccc";  
      }
  
      console.log(`Checking ${sourceId} → ${targetId} prerequisites:`, targetCourse.PREREQS);
  
      let prereqMet = false;
      let prereqExists = false;
  
      // Build a course map for easy lookup
      const courseMap = {};
      RG_prereqData.forEach(course => {
          courseMap[course._id?.$oid] = course.courseID;
      });
  
      targetCourse.PREREQS.forEach(prereq => {
          console.log(`Checking prereq object:`, prereq);
          prereqExists = true;
  
          let prereqPaths = extractPrereqPaths(prereq);
  
          // Normalize extracted prerequisite paths to match selected nodes
          let normalizedPrereqPaths = prereqPaths.map(courseId => courseMap[courseId] || courseId);
          
          console.log(`Normalized prerequisite paths for ${targetId}:`, normalizedPrereqPaths);
          console.log(`Extracted prerequisite paths for ${targetId}:`, JSON.stringify(prereqPaths, null, 2));

          console.log(`Current selected nodes:`, [...selectedNodes]);
  
          if (prereq.type === "&&") {
              // Ensure all AND conditions are fully met
              const allPathsMet = normalizedPrereqPaths.every(courseId => selectedNodes.has(courseId));
              if (allPathsMet) {
                  console.log(`All AND conditions met for ${targetId}`);
                  prereqMet = true;
              }
          } else if (prereq.type === "||") {
              // Ensure at least one OR condition is met
              const somePathMet = normalizedPrereqPaths.some(courseId => selectedNodes.has(courseId));
              if (somePathMet) {
                  console.log(`At least one OR condition met for ${targetId}`);
                  prereqMet = true;
              }
          }
      });
  
      console.log(`For edge ${sourceId} → ${targetId}: prereqExists=${prereqExists}, prereqMet=${prereqMet}`);
  
      if (prereqMet) return "#33ff33";  // Green - Prerequisite met
      if (prereqExists) return "#f5ff33";  // Yellow - One node selected, prerequisite not fully met
      return "#ff3333";  // Red - Node selected, but no prerequisite node clicked
    };
  
  


  const updateLineColors = () => {
    console.log("Updating line colors...");
    svg.selectAll(".link")
        .transition().duration(200)  // Ensure smooth updates
        .attr("stroke", d => {
            console.log(`Checking edge: ${d.source.data.name} → ${d.target.data.name}`);
            return determineLineColor(d);
        });
  };
  


  // Render links
  svg.selectAll(".link")
    .data(root.links())
    .enter()
    .append("line")
    .attr("class", "link")  // Ensure lines can be selected later
    .attr("x1", d => d.source.y)
    .attr("y1", d => d.source.x)
    .attr("x2", d => d.target.y)
    .attr("y2", d => d.target.x)
    .attr("stroke-width", 2)
    .attr("stroke", d => {
      console.log(`Checking edge: ${d.source.data.name} → ${d.target.data.name}`);
      return determineLineColor(d);
    });
    console.log("Total links found:", svg.selectAll(".link").size());

  // Render nodes
  svg.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("circle")
    .attr("cx", d => d.y)
    .attr("cy", d => d.x)
    .attr("r", 10)
    .attr("fill", d => selectedNodes.has(d.data.name) ? "#ff5733" : "#69b3a2")
    .on("click", function(event, d) {
      if (!d.data || !d.data.name) {
          console.error("Node clicked but name is missing:", d);
          return;
      }
  
      console.log("Clicked node data:", d);
  
      const nodeId = d.data.name; 
  
      if (!nodeId) return; // Prevent adding undefined values
      
      let action = '';
      if (selectedNodes.has(nodeId)) {
          selectedNodes.delete(nodeId);
          d3.select(this).attr("fill", "#69b3a2"); // Reset color when deselected
          action = 'remove';
      } else {
          selectedNodes.add(nodeId);
          d3.select(this).attr("fill", "#ff5733"); // Highlight selected node
          action = 'add';
      }
  
      console.log("Selected Nodes:", [...selectedNodes]); 
      
      if (currentUserId) {
        // Immediately trigger the API call to update the user's completed courses
        axios.post(`${import.meta.env.VITE_API_URL}/api/users/updateCompleted`, {
          userId: currentUserId,  // currentUserId should be defined (e.g., passed as a prop)
          course: nodeId,
          action: action
        }, { withCredentials: true })
        .then(response => {
          console.log("User completed courses updated:", response.data);
        })
        .catch(error => {
          console.error("Error updating completed courses:", error);
        });
      } else {
        console.warn("No current user ID found. User must be logged in.");
      }

      setTimeout(updateLineColors, 50); // Ensure the UI updates
  })  
  .on("contextmenu", async function (event, d) {
    event.preventDefault();  // Prevent default right-click menu
  
    console.log("Right-clicked node:", d.data.name);
  
    // Ensure RG_prereqData is loaded
    if (!RG_prereqData) {
      console.warn("RG_prereqData is not loaded yet.");
      return;
    }
  
    // Find the course details from reference_graph
    const course = RG_prereqData.find(c => c.courseID === d.data.name);

    // Fetch full details from reference_graph
    if (course) {
      onNodeRightClick({
        ...course,
        title: course.title || "No title available",
        units: course.units || "Unknown units",
        description: course.description || "No description available"
      });
    } else {
      console.warn(`Course '${d.data.name}' not found in reference_graph.`);
    }

    
    if (course) {
      onNodeRightClick(course);  // Pass course details to the modal
    } else {
      console.warn(`Course '${d.data.name}' not found in reference_graph.`);
    }
  });
  
  

    // Add labels
    svg.selectAll(".text")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("x", d => d.y + 10)
      .attr("y", d => d.x)
      .text(d => d.data.name)
      .attr("font-size", "12px");
    
    updateLineColors();
  };

  return (
    <div>
      <h2>Course Dependency Tree</h2>
      <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Enter course name (e.g. CS 010A)"/>
      <button onClick={fetchCourseData}>Search</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div id="tree"></div>
    </div>
  );
};

export default CourseTree;
