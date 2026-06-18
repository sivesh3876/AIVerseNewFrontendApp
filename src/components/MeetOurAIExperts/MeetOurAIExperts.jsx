import { useEffect, useRef, useState } from "react";
import "./MeetOurAIExperts.scss";

const defaultExperts = [
  {
    name: "Robert Kim",
    title: "Senior Engineer",
    image: "https://i.pravatar.cc/160?img=11",
  },
  {
    name: "Maria Garcia",
    title: "AI Ethics Lead",
    image: "https://i.pravatar.cc/160?img=5",
  },
  {
    name: "Tom Morrison",
    title: "Innovation Director",
    image: "https://i.pravatar.cc/160?img=12",
  },
  {
    name: "Dr. Sarah Chen",
    title: "Chief AI Officer",
    image: "https://i.pravatar.cc/160?img=47",
  },
  {
    name: "Michael Rodriguez",
    title: "VP of Engineering",
    image: "https://i.pravatar.cc/160?img=33",
  },
  {
    name: "Priya Patel",
    title: "Director of Research",
    image: "https://i.pravatar.cc/160?img=45",
  },
];

const getExpertAnimation = (index, total) => {
  const center = (total - 1) / 2;
  const distanceFromCenter = Math.abs(index - center);

  return {
    animationDelay: `${distanceFromCenter * 0.14}s`,
    textDelay: `${distanceFromCenter * 0.14 + 0.35}s`,
  };
};

const MeetOurAIExperts = ({
  experts = defaultExperts,
  title = "Meet Our AI Experts",
}) => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`ai_experts ${visible ? "animate" : ""}`}
      ref={sectionRef}
    >
      <div className="ai_experts__container">
        <h2>{title}</h2>

        <div className="ai_experts__grid">
          {experts.map((expert, index) => {
            const { animationDelay, textDelay } = getExpertAnimation(
              index,
              experts.length,
            );

            return (
              <article
                className="ai_experts__card"
                key={expert.name}
                style={{
                  "--avatar-delay": animationDelay,
                  "--text-delay": textDelay,
                }}
              >
                <div className="ai_experts__avatar-wrap">
                  <img src={expert.image} alt={expert.name} />
                </div>
                <div className="ai_experts__info">
                  <h3>{expert.name}</h3>
                  <p>{expert.title}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MeetOurAIExperts;
