import { useEffect, useState } from "react";
import { Project } from "../types/Project";
import { useNavigate } from "react-router-dom";

function ProjectList({ selectedCategories }: { selectedCategories: string[] }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async() => {
            const categoryParams = selectedCategories
            .map((cat) => `projectTypes=${encodeURIComponent(cat)}`)
            .join('&');
            const response = await fetch(`https://localhost:5000/water/allprojects?pageHowMany=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}`: ''}`, {
                credentials: "include",
        });
            const data = await response.json();
            setProjects(data.projects);
            setTotalItems(data.totalNumber);
            setTotalPages(Math.ceil(totalItems/pageSize))
        }

        fetchProjects();
    }, [pageSize, pageNum, selectedCategories]);

    return(
        <>
            <br/>
            {projects.map((p) =>
            <div id="projectCard" className='card' key={p.projectId}>
                    <h3 className="card-title">{p.projectName}</h3>
                    <div className="card-body">
                        <ul className="list-unstyled">
                            <li><strong>Project Type:</strong> {p.projectType}</li>
                            <li><strong>Project Regional Program:</strong> {p.projectRegionalProgram}</li>
                            <li><strong>Project Impact: </strong>{p.projectImpact}</li>
                            <li><strong>Project Phase: </strong>{p.projectPhase}</li>
                            <li><strong>Project Status: </strong>{p.projectFunctionalityStatus}</li>
                        </ul>
                        <button className="btn btn-success" onClick={() => navigate(`/donate/${p.projectName}/${p.projectId}`)}>Donate</button>
                    </div>
                </div>
            )}

            <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>Previous</button>

            {[...Array(totalPages)].map((_, index) => (
                    <button key={index +1} onClick={() => setPageNum(index + 1)} disabled= {pageNum === index + 1}>
                        {index + 1}
                    </button>
                )
            )}
            <button disabled={pageNum === totalPages} onClick={() => setPageNum(pageNum + 1)}>Next</button>


                <br />
                <label> Results per page:</label>
                    <select value={pageSize} onChange={(p) => {
                        setPageSize(Number(p.target.value));
                        setPageNum(1);
                    }}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
        </>
    );
}

export default ProjectList