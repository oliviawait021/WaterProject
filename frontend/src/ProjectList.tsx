import { useEffect, useState } from "react";
import { Project } from "./types/Project";

function ProjectList(){

    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async() => {
            const response = await fetch("https://localhost:5000/api/water/allprojects");
            const data = await response.json();
            setProjects(data);
        }

        fetchProjects();
    }, []);

    return(
        <>
            <h1>Water Projects</h1>
            <br/>
            {projects.map((p) =>
            <div id="projectCard">
                <h3>{p.projectName}</h3>
                <ul>
                    <li>Project Type: {p.projectType}</li>
                    <li>Project Regional Program: {p.projectRegionalProgram}</li>
                    <li>Project Impact: {p.projectImpact}</li>
                    <li>Project Phase: {p.projectPhase}</li>
                    <li>Project Status: {p.projectFunctionalityStatus}</li>
                </ul>
            </div>
        
        )}
        </>
    );
}

export default ProjectList