import { useEffect, useRef, useState } from "react";
import "./MeetOurAIExperts.scss";

const defaultExperts = [
  {
    id: 1,
    name: "Sapna Sharma",
    email: "sapna.sharma@espire.com",
    designation: "Senior Vice President - Business Excellence & Quality Assurancee",
    image: "/Sapna Sharma.jpg",
  },
  {
    id: 2,
    name: "Gurudatta Prakash Kamath",
    email: "gurudatta.kamath@espire.com",
    designation: "Director Data and AI/Gen AI",
    image: "/gurudatta.jpg",
  },
  {
    id: 3,
    name: "Amardeep Kumar",
    email: "amardeep.kumar@espire.com",
    designation: "Senior Director- CCM Services",
    image: "/Amardeep Kumar.jpg",
  },
  {
    id: 4,
    name: "Vikas Kumar",
    email: "vikas.kumar@espire.com",
    designation: "Senior Director- Customer Experience Solutions",
    image: "/Vikas Kumar.jpg",
  },
  {
    id: 5,
    name: "Ankit Mehrotra",
    email: "ankit.mehrotra@espire.com",
    designation: "Associate Director – Architecture & Solutions",
    image: "/Ankit Mehrotra.jpg",
  },
  {
    id: 6,
    name: "Niladri Dasmahapatra",
    email: "niladri.dasmahapatra@espire.com",
    designation: "Director - Solutions",
    image: "/Niladri Dasmahapatra.jpg",
  },
  {
    id: 7,
    name: "Praveen Ramachandra",
    email: "praveen.ramachandra@espire.com",
    designation: "Senior Director- Salesforce",
    image: "/Praveen Ramachandra.jpg",
  },
  {
    id: 8,
    name: "Rishi Kumar Yadav",
    email: "rishi.yadav@espire.com",
    designation: "Senior Program Manager - Software",
    image: "/Rishi Kumar Yadav.jpg",
  },
  {
    id: 9,
    name: "Kishor Swamisharan Pathak",
    email: "kishor.pathak@espire.com",
    designation: "Principal Architect - Software",
    image: "/Kishor Swamisharan Pathak.jpg",
  },
  {
    id: 10,
    name: "Soorya Vyas",
    email: "soorya.vyas@espire.com",
    designation: "Lead Full-Stack AI Engineer",
    image: "/sooryaimg.jpg",
  },
  {
    id: 11,
    name: "Varun Malik",
    email: "varun.malik@espire.com",
    designation: "Technical Architect",
    image: "/VarunMalik.jpg",
  },
  {
    id: 12,
    name: "Nisha",
    email: "nisha@espireinfo.co.uk",
    designation: "Manager - Business Excellence",
    image: "/Nisha.jpg",
  },
  {
    id: 13,
    name: "Ruchi Verma",
    email: "ruchi.verma@espire.com",
    designation: "Lead - Architecture and Solutions Software",
    image: "/RuchiVerma.jpg",
  },
  {
    id: 14,
    name: "Gurudeo Singh",
    email: "gurudeo.singh@espire.com",
    designation: "Associate Director",
    image: "/GurudeoSingh.jpg",
  },
  {
    id: 15,
    name: "Gagan Chandani",
    email: "gagan.chandani@espire.com",
    designation: "Technical Architect",
    image: "/GaganChandani.jpg",
  },
  {
    id: 16,
    name: "Rekha Bhatnagar",
    email: "rekha.bhatnagar@espire.com",
    designation: "Senior Test Leader",
    image: "/RekhaBhatnagar.jpg",
  },
  {
    id: 17,
    name: "Javed Khan",
    email: "javed.khan@espire.com",
    designation: "Lead Engineer",
    image: "/JavedKhan.jpg",
  },
  {
    id: 18,
    name: "Girijesh Pandey",
    email: "girijesh.pandey@espire.com",
    designation: "Test Engineer",
    image: "/GirijeshPandey.jpg",
  },
  {
    id: 19,
    name: "Archit Mehra",
    email: "archit.mehra@espire.com",
    designation: "Deputy Manager- Training",
    image: "/ArchitMehra.jpg",
  },
  {
    id: 20,
    name: "Sivesh Kumar",
    email: "sivesh.kumar@espire.com",
    designation: "Technical Leader - Software",
    image: "/Sivesh Kumar.jpg",
  },
  {
    id: 21,
    name: "Jayendra Dhar Dwivedi",
    email: "jayendra.dwivedi@espire.com",
    designation: "Associate Technical Architect - Software",
    image: "/Jayendra Dhar Dwivedi.jpg",
  },
];

const MeetOurAIExperts = ({
  experts = defaultExperts,
  title = "Meet Our AI Experts",
}) => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const marqueeItems = [...experts, ...experts];

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

        <div className="ai_experts__marquee" aria-label="AI experts team">
          <div className="ai_experts__track">
            {marqueeItems.map((expert, index) => (
              <article
                className="ai_experts__card"
                key={`${expert.id}-${index}`}
                aria-hidden={index >= experts.length}
              >
                <div className="ai_experts__avatar-wrap">
                  <img src={expert.image} alt={expert.name} loading="lazy" />
                </div>
                <div className="ai_experts__info">
                  <h3>{expert.name}</h3>
                  <p>{expert.designation ?? expert.title}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetOurAIExperts;
