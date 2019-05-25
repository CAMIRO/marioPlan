import React from "react";
import ProjectSummary from "./ProjectSummary";

const ProjectList = ({ projects }) => {
  return (
    <div className="project-list section">
      {/*  { projects && projects.map(project =>{})} this way you validate if is projects inside the store, id dont...dont do the map loop   */}
      {projects &&
        projects.map(project => {
          return <ProjectSummary project={project} key={project.id} />;
        })}
    </div>
  );
};
export default ProjectList;
