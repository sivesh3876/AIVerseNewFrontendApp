import { useState } from "react";

import "../styles/ai-readiness/base.css";
import "../styles/ai-readiness/assessment.css";
import "../styles/ai-readiness/all-questions.css";
import "../styles/ai-readiness/dashboard.css";
import "../styles/ai-readiness/instructions.css";
import "../styles/ai-readiness/results.css";
import "../styles/ai-readiness/summary.css";
import "../styles/ai-readiness/welcome.css";
import "../styles/ai-readiness/responsive.css";
import "../styles/ai-readiness/legacy-welcome.css";

import assessmentData from "../data/aiReadinessAssessmentData";
import logo from "../assets/ai-readiness/logo.svg";
import heroBackground from "../assets/ai-readiness/slider1.svg";

import WelcomePage from "../components/AIReadiness/WelcomePage";
import AssessmentFlow from "../components/AIReadiness/AssessmentFlow";
import AnswerSummary from "../components/AIReadiness/AnswerSummary";
import ResultsPage from "../components/AIReadiness/ResultsPage";

import { buildApiPath } from "../services/apiConfig";


import {
  getDimensionForQuestion,
  getReadinessLevel,
  maturityLevels,
  scoringTips,
} from "../utils/aiReadinessAssessmentUtils";

const PROGRESS_STORAGE_KEY = "aiReadinessAssessmentProgress";

function AIReadinessAssessmentPage() {
  const questions = assessmentData.flatMap(
    (dimension) => dimension.questions
  );

  const totalQuestions = questions.length;
  const totalDimensions = assessmentData.length;

  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [backendResult, setBackendResult] = useState(null);
  const [error, setError] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

  const [hasSavedProgress, setHasSavedProgress] = useState(() =>
    Boolean(localStorage.getItem(PROGRESS_STORAGE_KEY))
  );

  const [showSummary, setShowSummary] = useState(false);

  const overallScore = backendResult?.overallScore ?? 0;

  const readinessLevel = getReadinessLevel(overallScore);

  const dimensionResults = backendResult?.dimensions ?? [];

  const currentDimension = getDimensionForQuestion(
    assessmentData,
    questionIndex
  );

  const progress =
    totalQuestions > 0
      ? Math.round(((questionIndex + 1) / totalQuestions) * 100)
      : 0;

  const updateAnswer = (index, value) => {
    const newAnswers = [...answers];

    newAnswers[index] = value;

    setAnswers(newAnswers);
    setError("");
  };

  const resetAssessment = (returnToWelcome = false) => {
    setAnswers([]);
    setQuestionIndex(0);
    setSubmitted(false);
    setShowSummary(false);
    setSubmitting(false);
    setBackendResult(null);
    setError("");

    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    setHasSavedProgress(false);

    if (returnToWelcome) {
      setStarted(false);
    }
  };

  const startAssessment = () => {
    setAnswers([]);
    setQuestionIndex(0);
    setSubmitted(false);
    setShowSummary(false);
    setSubmitting(false);
    setBackendResult(null);
    setError("");
    setStarted(true);
  };

  const resumeAssessment = () => {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);

    if (!saved) return;

    try {
      const progressState = JSON.parse(saved);

      setAnswers(progressState.answers ?? []);
      setQuestionIndex(progressState.questionIndex ?? 0);
      setStarted(true);
    } catch (resumeError) {
      console.error(
        "Failed to resume AI readiness assessment:",
        resumeError
      );

      localStorage.removeItem(PROGRESS_STORAGE_KEY);
      setHasSavedProgress(false);
    }
  };

  const saveAndExit = () => {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        answers,
        questionIndex,
        currentDimension,
      })
    );

    setHasSavedProgress(true);
    setStarted(false);
  };

  const handleSubmit = async () => {
    setError("");

    const unansweredQuestions = questions.filter(
      (_, index) => answers[index] === undefined
    );

    if (unansweredQuestions.length > 0) {
      setError(
        `Please answer all questions before submitting. ${
          unansweredQuestions.length
        } question${
          unansweredQuestions.length === 1 ? "" : "s"
        } remaining.`
      );

      return;
    }

    const answerPayload = {};

    questions.forEach((question, index) => {
      const value = answers[index];

      if (value !== undefined) {
        answerPayload[question.id] = value;
      }
    });

    setSubmitting(true);

    try {
      const response = await fetch(buildApiPath("assessment"), {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
        },
        body: JSON.stringify({
          answers: answerPayload,
        }),
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "The assessment could not be submitted. Please try again."
        );
      }

      if (
        typeof data?.overallScore !== "number" ||
        !data?.readinessLevel ||
        !Array.isArray(data?.dimensions)
      ) {
        throw new Error(
          "The backend returned an invalid assessment result."
        );
      }

      setBackendResult(data);
      setShowSummary(true);
      setSubmitted(true);

      localStorage.removeItem(PROGRESS_STORAGE_KEY);
      setHasSavedProgress(false);
    } catch (submissionError) {
      console.error(
        "Assessment submission failed:",
        submissionError
      );

      setError(
        submissionError?.message ||
          "Failed to connect to the assessment API. Make sure the backend is running."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSummaryBack = () => {
    setShowSummary(false);
    setSubmitted(false);
  };

  const handleSummaryDashboard = () => {
    setShowSummary(false);
    setSubmitted(true);
  };

  const confirmRetake = () => {
    if (
      window.confirm(
        "Are you sure you want to retake the assessment? Your current results will be cleared."
      )
    ) {
      resetAssessment(false);
    }
  };

  const confirmStartOver = () => {
    if (window.confirm("Are you sure you want to start over?")) {
      resetAssessment(true);
    }
  };

  // Welcome screen
  if (!started) {
    return (
      <WelcomePage
        heroBackground={heroBackground}
        assessmentData={assessmentData}
        totalQuestions={totalQuestions}
        totalDimensions={totalDimensions}
        hasSavedProgress={hasSavedProgress}
        onStart={startAssessment}
        onResume={resumeAssessment}
        instructionsOpen={showInstructions}
        onOpenInstructions={() => setShowInstructions(true)}
        onCloseInstructions={() => setShowInstructions(false)}
        maturityLevels={maturityLevels}
        scoringTips={scoringTips}
      />
    );
  }

  // Answer review screen
  if (showSummary && backendResult) {
    return (
      <AnswerSummary
        assessmentData={assessmentData}
        questions={questions}
        answers={answers}
        maturityLevels={maturityLevels}
        onBack={handleSummaryBack}
        onDashboard={handleSummaryDashboard}
      />
    );
  }

  // Results screen
  if (submitted && backendResult) {
    return (
      <ResultsPage
        logo={logo}
        heroBackground={heroBackground}
        overallScore={overallScore}
        readinessLevel={readinessLevel}
        dimensionResults={dimensionResults}
        totalDimensions={totalDimensions}
        onRetake={confirmRetake}
        onStartOver={confirmStartOver}
      />
    );
  }

  // Questions / assessment screen
  return (
    <AssessmentFlow
      logo={logo}
      heroBackground={heroBackground}
      assessmentData={assessmentData}
      questions={questions}
      totalQuestions={totalQuestions}
      totalDimensions={totalDimensions}
      currentDimension={currentDimension}
      questionIndex={questionIndex}
      progress={progress}
      answers={answers}
      error={error}
      submitting={submitting}
      maturityLevels={maturityLevels}
      scoringTips={scoringTips}
      instructionsOpen={showInstructions}
      onOpenInstructions={() => setShowInstructions(true)}
      onCloseInstructions={() => setShowInstructions(false)}
      onAnswer={updateAnswer}
      onSubmit={handleSubmit}
      onSaveExit={saveAndExit}
    />
  );
}

export default AIReadinessAssessmentPage;