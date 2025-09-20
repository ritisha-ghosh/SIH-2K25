import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Sparkles,
  ArrowRight,
  Book,
  Code,
  Globe,
  Search,
  Loader2,
  Frown,
  Building,
  List,
  SortAsc,
  SortDesc,
  Calendar,
  MapPin,
} from "lucide-react";

const Dashboard = ({ token, username, onMessage }) => {
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [allInternships, setAllInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  // Data lists for professional-looking demo
  const educationOptions = [
    "B.Tech",
    "M.Tech",
    "B.Sc",
    "M.Sc",
    "B.Com",
    "BBA",
    "MBA",
    "PhD",
    "BCA",
    "MCA",
    "Diploma in Engineering",
    "High School",
  ];
  const skillsOptions = [
    "Python",
    "Java",
    "React",
    "SQL",
    "Machine Learning",
    "TensorFlow",
    "HTML",
    "CSS",
    "JavaScript",
    "Network Security",
    "Figma",
    "Sketch",
    "UI/UX Principles",
    "Digital Marketing",
    "Social Media",
    "Data Analysis",
    "Cloud Computing",
    "AWS",
    "Azure",
    "Git",
    "Agile Methodologies",
    "C++",
    "C#",
    "MongoDB",
    "Node.js",
    "Express.js",
    "Spring Boot",
    "R Programming",
  ];
  const interestsOptions = [
    "IT",
    "Finance",
    "Tech",
    "Security",
    "Design",
    "Marketing",
    "Healthcare",
    "Education",
    "E-commerce",
    "Automotive",
    "Manufacturing",
    "Consulting",
    "Research & Development",
    "Biotechnology",
  ];

  useEffect(() => {
    const fetchInitialRecommendations = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/api/internships/recommend",
          {
            headers: { "x-auth-token": token },
          }
        );
        setRecommendations(res.data);
      } catch (err) {
        onMessage(
          err.response?.data?.msg || "Failed to fetch initial recommendations."
        );
      } finally {
        setIsLoading(false);
      }
    };
    const fetchAllInternships = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/internships/all",
          {
            headers: { "x-auth-token": token },
          }
        );
        setAllInternships(res.data);
      } catch (err) {
        onMessage(
          err.response?.data?.msg || "Failed to fetch all internships."
        );
      }
    };
    fetchInitialRecommendations();
    fetchAllInternships();
  }, [token, onMessage]);

  const handleRecommend = async () => {
    setIsLoading(true);
    setRecommendations([]);
    onMessage("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/internships/refine",
        {
          education,
          skills: skills.split(",").map((s) => s.trim()),
          interests,
        },
        { headers: { "x-auth-token": token } }
      );
      setRecommendations(res.data);
      if (res.data.length === 0) {
        onMessage("No recommendations found for your criteria.");
      }
    } catch (err) {
      onMessage(err.response?.data?.msg || "Failed to get recommendations.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = () => {
    const newOrder = sortOrder === "newest" ? "oldest" : "newest";
    setSortOrder(newOrder);
    setRecommendations((prev) => [...prev].reverse());
    onMessage(`Sorted by ${newOrder}.`);
  };

  const renderRecommendationIcon = (sector) => {
    switch (sector.toLowerCase()) {
      case "it":
      case "tech":
      case "engineering":
        return <Code className="w-5 h-5 text-blue-500" />;
      case "finance":
      case "business":
        return <Book className="w-5 h-5 text-green-500" />;
      case "design":
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      default:
        return <Building className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="text-gray-900 dark:text-white transition-colors duration-300">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold">Hello, {username}!</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
          >
            <List className="w-4 h-4" />
            <span>
              {showAll ? "Show Top Recommendations" : "View All Internships"}
            </span>
          </button>
          {showAll && (
            <button
              onClick={handleSort}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
            >
              {sortOrder === "newest" ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
              <span>
                {sortOrder === "newest" ? "Newest First" : "Oldest First"}
              </span>
            </button>
          )}
        </div>
      </div>

      {!showAll && (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-500 rounded-full shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Refine Your Search
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="education"
                className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
              >
                Education
              </label>
              <input
                type="text"
                id="education"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="e.g., B.Tech"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                list="educationOptions"
              />
              <datalist id="educationOptions">
                {educationOptions.map((opt) => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
            </div>
            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
              >
                Skills
              </label>
              <input
                type="text"
                id="skills"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="e.g., Python, SQL"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                list="skillsOptions"
              />
              <datalist id="skillsOptions">
                {skillsOptions.map((opt) => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
            </div>
            <div>
              <label
                htmlFor="interests"
                className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
              >
                Interests
              </label>
              <input
                type="text"
                id="interests"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="e.g., IT, Finance"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                list="interestsOptions"
              />
              <datalist id="interestsOptions">
                {interestsOptions.map((opt) => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
            </div>
          </div>
          <button
            onClick={handleRecommend}
            disabled={isLoading}
            className="mt-6 w-full px-6 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="animate-spin" />
                <span>Finding Matches...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>Refine Search</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </button>
        </div>
      )}

      <div className="animate-fadeIn">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          {showAll ? "All Internships" : "Recommended for You"}
        </h3>
        {isLoading ? (
          <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
            <p className="text-gray-500 dark:text-gray-400">
              Fetching recommendations from our AI... please wait.
            </p>
          </div>
        ) : (showAll ? allInternships : recommendations).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showAll ? allInternships : recommendations).map((rec, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                    {renderRecommendationIcon(rec.sector)}
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                    {rec.title}
                  </h4>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>
                    <span className="font-semibold">Sector:</span> {rec.sector}
                  </p>
                  <p>
                    <span className="font-semibold">Skills:</span>{" "}
                    {rec.skills.join(", ")}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {rec.location}
                  </p>
                  {rec.justification && (
                    <p className="mt-2 text-gray-700 dark:text-gray-300 italic">
                      "{rec.justification}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner">
            <Frown className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">
              No internships match your criteria. Try adjusting your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
