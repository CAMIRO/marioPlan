import React from "react";

function ProjectDetails(props) {
  const id = props.match.params.id;
  return (
    <div className="container section project-details">
      <div className="card z-depth-0">
        <div className="card-content">
          <span className="card-title">Project Title - {id}</span>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
            quidem enim minima provident consequuntur iure sequi nisi eligendi
            porro dolorum non, dolores saepe recusandae incidunt soluta deleniti
            aut! Quia, cupiditate.
          </p>
        </div>
        <div className="card-action grey lighten-4 grey-text">
          <div>Posted by camiro</div>
          <div>2nd September, 2am</div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
