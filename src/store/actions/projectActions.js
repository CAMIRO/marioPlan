export const createProject = project => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //make async call to database

    //dispatch the action// parsing the dispatch
    dispatch({ type: "CREATE_PROJECT", project: project });
  };
};
