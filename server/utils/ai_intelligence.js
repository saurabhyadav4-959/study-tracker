/**
 * ADVANCED AI ACADEMIC INTELLIGENCE SYSTEM
 * Purely algorithmic analysis based on student performance data.
 */

const analyzePerformance = (studentData) => {
  const {
    student_name,
    weekly_study_hours,
    consistency_score,
    focus_score,
    completed_tasks,
    missed_tasks,
    backlog_count
  } = studentData;

  const consistency = parseInt(consistency_score) || 0;
  const focus = parseInt(focus_score) || 0;
  const missed = parseInt(missed_tasks) || 0;
  const backlogs = parseInt(backlog_count) || 0;

  // Rule-based logic
  let overall_status = "STABLE";
  if (consistency < 70 || backlogs > 5) overall_status = "CONCERN_DETECTED";
  if (consistency < 50 || backlogs > 10) overall_status = "URGENT_INTERVENTION_REQUIRED";

  const strengths = [];
  if (consistency >= 80) strengths.push("Exceptional Study Discipline");
  if (focus >= 80) strengths.push("High Depth Focus Concentration");
  if (completed_tasks > 20) strengths.push("High Execution Rate");
  if (strengths.length === 0) strengths.push("Foundational Stability");

  const weak_areas = [];
  if (consistency < 70) weak_areas.push("Study Discipline Inconsistency");
  if (focus < 60) weak_areas.push("Concentration & Focus Depth");
  if (missed > 5) weak_areas.push("Task Execution Reliability");
  if (backlogs > 5) weak_areas.push("Growing Backlog Pressure");

  return {
    module: "performance_report",
    title: "Performance Report",
    overall_status,
    summary: `${student_name} is showing ${overall_status.toLowerCase().replace('_', ' ')} patterns. Execution rate is ${completed_tasks} completed vs ${missed} missed.`,
    strengths,
    weak_areas,
    consistency_analysis: consistency < 70 ? "Inconsistent daily study pattern detected. Discipline intervention suggested." : "Solid consistency maintained across the tracked period.",
    focus_analysis: focus < 60 ? "Concentration levels are below optimal threshold. Suggest focus-mode techniques." : "Strong focus depth observed during study sessions.",
    performance_score: Math.round((consistency + focus + (completed_tasks / (completed_tasks + missed || 1)) * 100) / 3) + "%"
  };
};

const analyzeImprovements = (studentData) => {
  const {
    consistency_score,
    focus_score,
    missed_tasks,
    backlog_count,
    worst_study_time
  } = studentData;

  const consistency = parseInt(consistency_score) || 0;
  const focus = parseInt(focus_score) || 0;
  const missed = parseInt(missed_tasks) || 0;
  const backlogs = parseInt(backlog_count) || 0;

  const critical_requirements = [];
  if (backlogs > 5) critical_requirements.push("Immediate Backlog Clearance Protocol");
  if (consistency < 50) critical_requirements.push("Fixed Study Window Mandate");
  
  const discipline_fixes = [];
  if (consistency < 70) discipline_fixes.push("Daily Check-in Enforcement");
  if (missed > 3) discipline_fixes.push("Task Prioritization Mapping");

  const study_habit_fixes = [];
  if (worst_study_time) study_habit_fixes.push(`Minimize distractions during ${worst_study_time}`);
  study_habit_fixes.push("Implement Active Recall sessions");

  const focus_improvements = [];
  if (focus < 60) focus_improvements.push("Digital Distraction Shielding");
  focus_improvements.push("45/15 Pomodoro Cycles");

  const time_management_fixes = [];
  if (backlogs > 0) time_management_fixes.push("Early Morning Buffer Slot");
  time_management_fixes.push("Weekly Objective Pre-planning");

  return {
    module: "improvement_requirements",
    title: "Required Improvements",
    critical_requirements,
    discipline_fixes,
    study_habit_fixes,
    focus_improvements,
    time_management_fixes
  };
};

const analyzeGrowth = (studentData) => {
  const { consistency_score, focus_score } = studentData;
  const consistency = parseInt(consistency_score) || 0;
  const focus = parseInt(focus_score) || 0;

  return {
    module: "growth_opportunities",
    title: "Growth Opportunities",
    optimization_opportunities: [
      "Advanced Time-Blocking Techniques",
      "Interleaved Practice Strategy",
      "Spaced Repetition Automation"
    ],
    advanced_suggestions: [
      "Peer Teaching Simulations",
      "Synthesized Concept Mapping",
      "Cognitive Load Management"
    ],
    hidden_growth_areas: [
      consistency > 80 ? "Transition to Research-Based Learning" : "Fundamental Discipline Strengthening",
      focus > 80 ? "Deep Work Hyper-Focus Extension" : "Incremental Concentration Threshold Expansion"
    ],
    performance_boosters: [
      "Gamma Wave Audio Stimulation during Focus",
      "Pre-Session Neural Priming",
      "End-of-Day Execution Audit"
    ]
  };
};

module.exports = {
  generateReport: (moduleType, studentData) => {
    switch (moduleType) {
      case 'performance_report':
        return analyzePerformance(studentData);
      case 'improvement_requirements':
        return analyzeImprovements(studentData);
      case 'growth_opportunities':
        return analyzeGrowth(studentData);
      default:
        return { error: "INVALID_MODULE" };
    }
  }
};
