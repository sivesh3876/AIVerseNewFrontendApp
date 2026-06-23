import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddAISolutionCard from "../AddAISolutionCard";
import TalkToExpertCard from "../TalkToExpertCard";
import {
  learnExploreTracks,
  getResourceById,
  getTrackIndexById,
  getResourcesByTrack,
} from "./learnExploreData";
import "./LearnExplore.scss";

const ResourceCard = ({ resource }) => (
  <article className="learn_explore__card" id={`resource-${resource.id}`}>
    <span
      className="learn_explore__card-badge"
      style={{ background: resource.badgeColor }}
    >
      {resource.badge}
    </span>

    <h3>{resource.title}</h3>
    <p>{resource.description}</p>
    <time dateTime={resource.date}>{resource.date}</time>

    <span className="learn_explore__card-link">Read More &gt;</span>
  </article>
);

const LearnExplore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trackId = searchParams.get("track") ?? "all";
  const articleId = searchParams.get("article");
  const [activeTrackIndex, setActiveTrackIndex] = useState(() =>
    getTrackIndexById(trackId),
  );

  useEffect(() => {
    if (articleId) {
      const resource = getResourceById(articleId);
      if (resource) {
        setActiveTrackIndex(getTrackIndexById(resource.trackId));
        return;
      }
    }

    setActiveTrackIndex(getTrackIndexById(trackId));
  }, [trackId, articleId]);

  useEffect(() => {
    if (!articleId) {
      return;
    }

    const element = document.getElementById(`resource-${articleId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [articleId, activeTrackIndex]);

  const activeTrack = learnExploreTracks[activeTrackIndex];
  const resources = getResourcesByTrack(activeTrack.id);

  const handleTrackChange = (index) => {
    setActiveTrackIndex(index);
    navigate(`/learn-explore?track=${learnExploreTracks[index].id}`, {
      replace: true,
    });
  };

  return (
    <div className="learn_explore">
      <aside className="learn_explore__sidebar">
        <nav className="learn_explore__nav" aria-label="Content tracks">
          <h2>TRACKS</h2>
          <ul>
            {learnExploreTracks.map((track, index) => {
              const isActive = index === activeTrackIndex;
              const TrackIcon = track.icon;

              return (
                <li key={track.id}>
                  <button
                    type="button"
                    className={`learn_explore__nav-item${isActive ? " is-active" : ""}`}
                    onClick={() => handleTrackChange(index)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="learn_explore__nav-icon" aria-hidden="true">
                      <TrackIcon />
                    </span>
                    <span className="learn_explore__nav-label">{track.label}</span>
                    {isActive && (
                      <span className="learn_explore__nav-arrow" aria-hidden="true">
                        &rsaquo;
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <AddAISolutionCard />
        <TalkToExpertCard />
      </aside>

      <main className="learn_explore__main">
        <header className="learn_explore__header">
          <h1>Learn &amp; Explore</h1>
          <p>Explore the solutions</p>
        </header>

        <div className="learn_explore__grid">
          {resources.map((resource) => (
            <ResourceCard resource={resource} key={resource.id} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default LearnExplore;
