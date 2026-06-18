import { useNavigate } from "react-router-dom";
import "./AddAISolutionCard.scss";
import { SparkleIcon } from "../AddNewAISolution/FormIcons";

const AddAISolutionCard = ({
  title = "Add New AI Solution",
  description = "Submit your AI solution for a live demo or integrate it into the platform - everything you need to get started.",
  buttonText = "Add AI Solution",
  to = "/get-started",
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    navigate(to);
  };

  const buttonContent = (
    <>
      {buttonText}
      <span aria-hidden="true">&rarr;</span>
    </>
  );

  return (
    <article className="add_ai_solution_card">
      <div className="add_ai_solution_card__icon">
        <SparkleIcon />
      </div>

      <h3>{title}</h3>
      <p>{description}</p>

      <button type="button" className="add_ai_solution_card__btn" onClick={handleClick}>
        {buttonContent}
      </button>
    </article>
  );
};

export default AddAISolutionCard;
