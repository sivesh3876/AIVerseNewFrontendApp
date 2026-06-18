import { Link } from "react-router-dom";
import "./TalkToExpertCard.scss";
import StarIcon from "./StarIcon";

const TalkToExpertCard = ({
  title = "Talk to an Expert",
  description = "Get a personalized walkthrough of CCM solutions tailored to your enterprise.",
  buttonText = "Schedule a Call",
  to,
  onClick,
}) => {
  const buttonContent = (
    <>
      {buttonText}
      <span aria-hidden="true">&rarr;</span>
    </>
  );

  return (
    <article className="talk_to_expert_card">
      <div className="talk_to_expert_card__header">
        <span className="talk_to_expert_card__icon" aria-hidden="true">
          <StarIcon />
        </span>
        <h3>{title}</h3>
      </div>

      <p>{description}</p>

      {onClick ? (
        <button type="button" className="talk_to_expert_card__btn" onClick={onClick}>
          {buttonContent}
        </button>
      ) : to ? (
        <Link to={to} className="talk_to_expert_card__btn">
          {buttonContent}
        </Link>
      ) : (
        <button type="button" className="talk_to_expert_card__btn">
          {buttonContent}
        </button>
      )}
    </article>
  );
};

export default TalkToExpertCard;
