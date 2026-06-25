import { Navigate, useParams } from "react-router-dom";

const SolutionDetails = () => {
  const { id } = useParams();

  if (!id) {
    return <Navigate to="/explore-solutions" replace />;
  }

  return (
    <Navigate
      to={`/explore-solutions?solution=${encodeURIComponent(id)}`}
      replace
    />
  );
};

export default SolutionDetails;
