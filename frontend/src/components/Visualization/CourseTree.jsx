import { useState } from 'react';
import axios from 'axios'
import * as d3 from 'd3';

const CourseTree = () => {
  const [courseName, setCourseName] = useState('');
  const [courseData, setCourseData] = useState(null);
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
      
      const data = response.data;
      setCourseData(data);
      renderTree(data);
    } 
    catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching data.");    } finally {
      setLoading(false);
    }
  };

  const renderTree = (data) => {
    d3.select("#tree").selectAll("*").remove(); // Clear previous visualization

    const width = 800;
    const height = 600;

    const svg = d3.select("#tree").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(50, 50)");

    const treeLayout = d3.tree().size([height - 100, width - 100]);
    const root = d3.hierarchy(data);
    treeLayout(root);

    // Render links
    svg.selectAll(".link")
      .data(root.links())
      .enter()
      .append("line")
      .attr("x1", d => d.source.y)
      .attr("y1", d => d.source.x)
      .attr("x2", d => d.target.y)
      .attr("y2", d => d.target.x)
      .attr("stroke", "#ccc");

    // Render nodes
    svg.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("cx", d => d.y)
      .attr("cy", d => d.x)
      .attr("r", 6)
      .attr("fill", "#69b3a2");

    // Add labels
    svg.selectAll(".text")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("x", d => d.y + 10)
      .attr("y", d => d.x)
      .text(d => d.data.name)
      .attr("font-size", "12px");
  };

  return (
    <div>
      <h2>Course Dependency Tree</h2>
      <input
        type="text"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        placeholder="Enter course name (e.g. CS 010A)"
      />
      <button onClick={fetchCourseData}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div id="tree"></div>
    </div>
  );
};


export default CourseTree;
