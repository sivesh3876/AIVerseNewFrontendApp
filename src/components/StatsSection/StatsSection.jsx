import { useEffect, useRef, useState } from "react";
import "./StatsSection.scss";

import dollar from "../../assets/images/dollar.svg";
import smiley from "../../assets/images/smiley.svg";
import graph from "../../assets/images/graph.svg";
import clock from "../../assets/images/clock.svg";

const statsData = [
  {
    icon: dollar,
    value: "40%",
    label: "Cost Reduction",
    color: "#3A8D9D",
  },
  {
    icon: smiley,
    value: "20+",
    label: "AI Projects Completed",
    color: "#EF8E29",
  },
  {
    icon: graph,
    value: "100%",
    label: "Client Satisfaction",
    color: "#4D90E3",
  },
  {
    icon: clock,
    value: "24/7",
    label: "Support Available",
    color: "#18E0CC",
  },
];

const StatsSection = () => {
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
      className={`stats_section ${visible ? "animate" : ""}`}
      ref={sectionRef}
    >
      <div className="stats_container">
        {statsData.map((item, index) => (
          <div
            className="stat_card"
            key={index}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <img src={item.icon} alt={item.label} />

            <h2 style={{ color: item.color }}>{item.value}</h2>

            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
