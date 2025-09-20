import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  MapPin,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const Profile = ({ token, onMessage }) => {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const educationOptions = [
    "High School Diploma",
    "Associate Degree",
    "Bachelor of Technology (B.Tech)",
    "Bachelor of Engineering (B.E.)",
    "Bachelor of Science (B.Sc)",
    "Bachelor of Computer Applications (BCA)",
    "Bachelor of Business Administration (BBA)",
    "Bachelor of Commerce (B.Com)",
    "Bachelor of Arts (B.A.)",
    "Master of Technology (M.Tech)",
    "Master of Engineering (M.E.)",
    "Master of Science (M.Sc)",
    "Master of Computer Applications (MCA)",
    "Master of Business Administration (MBA)",
    "Master of Commerce (M.Com)",
    "Master of Arts (M.A.)",
    "Doctor of Philosophy (PhD)",
    "Diploma in Engineering",
    "Polytechnic Diploma",
    "Certificate Course",
    "Other",
  ];
  const fieldOfStudyOptions = [
    "Computer Science & Engineering",
    "Information Technology",
    "Software Engineering",
    "Data Science",
    "Artificial Intelligence",
    "Machine Learning",
    "Cybersecurity",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Biotechnology",
    "Business Administration",
    "Marketing",
    "Finance",
    "Accounting",
    "Human Resources",
    "Economics",
    "Psychology",
    "Graphic Design",
    "UI/UX Design",
    "Digital Marketing",
    "Content Writing",
    "Mathematics",
    "Statistics",
    "Physics",
    "Chemistry",
    "Biology",
    "Environmental Science",
    "Other",
  ];
  const skillsOptions = [
    "Python",
    "JavaScript",
    "Java",
    "C++",
    "C#",
    "C",
    "HTML5",
    "CSS3",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Express.js",
    "Next.js",
    "Bootstrap",
    "Tailwind CSS",
    "Sass",
    "Less",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Microsoft Azure",
    "Google Cloud Platform",
    "Docker",
    "Kubernetes",
    "Jenkins",
    "Git",
    "GitHub",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Seaborn",
    "Power BI",
    "Tableau",
    "Excel",
    "React Native",
    "Flutter",
    "iOS Development",
    "Android Development",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Figma",
    "Sketch",
    "UI/UX Design",
    "Digital Marketing",
    "SEO",
    "SEM",
    "Social Media Marketing",
    "Content Marketing",
    "Google Analytics",
    "Project Management",
    "Agile",
    "Scrum",
    "API Development",
    "REST APIs",
    "GraphQL",
    "Microservices",
    "Blockchain",
  ];
  const locationOptions = [
    "Remote",
    "Hybrid",
    "Mumbai, India",
    "Delhi, India",
    "Bangalore, India",
    "Hyderabad, India",
    "Chennai, India",
    "Kolkata, India",
    "Pune, India",
    "Ahmedabad, India",
    "Jaipur, India",
    "Surat, India",
    "New York, NY",
    "San Francisco, CA",
    "Los Angeles, CA",
    "Seattle, WA",
    "Boston, MA",
    "Austin, TX",
    "Chicago, IL",
    "London, UK",
    "Berlin, Germany",
    "Paris, France",
    "Singapore",
    "Tokyo, Japan",
    "Sydney, Australia",
    "Melbourne, Australia",
    "Toronto, Canada",
    "Vancouver, Canada",
    "Other",
  ];
  const experienceOptions = [
    "No Experience",
    "Less than 1 year",
    "1-2 years",
    "2-3 years",
    "3-5 years",
    "More than 5 years",
  ];
  const availabilityOptions = [
    "Immediately",
    "Within 1 week",
    "Within 2 weeks",
    "Within 1 month",
    "1-2 months",
    "2-3 months",
    "More than 3 months",
    "Flexible",
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { "x-auth-token": token },
        });
        setProfile(res.data);
      } catch (err) {
        onMessage(err.response?.data?.msg || "Failed to fetch user profile.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token, onMessage]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setFormMessage("");
    try {
      await axios.put("http://localhost:5000/api/users/profile", profile, {
        headers: { "x-auth-token": token },
      });
      setFormMessage("Profile updated successfully! 🎉");
      onMessage("Profile updated successfully!");
    } catch (err) {
      setFormMessage(err.response?.data?.msg || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner">
        <Loader2 className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 animate-fadeIn">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg">
          <User className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Your Profile
        </h3>
      </div>
      {formMessage && (
        <div className="mb-4 animate-fadeIn">
          <div
            className={`p-3 rounded-xl shadow-sm ${
              formMessage.includes("success")
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              {formMessage.includes("success") ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <p className="font-medium text-sm">{formMessage}</p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Basic Information
            </h4>
            <div className="relative">
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName || ""}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email || ""}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Education
            </h4>
            <div className="relative">
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Education Level
              </label>
              <select
                name="education"
                value={profile.education || ""}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
              >
                <option value="">Select education level</option>
                {educationOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Field of Study
              </label>
              <select
                name="fieldOfStudy"
                value={profile.fieldOfStudy || ""}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
              >
                <option value="">Select field of study</option>
                {fieldOfStudyOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="relative mb-6">
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Skills (Comma-separated)
          </label>
          <input
            type="text"
            name="skills"
            value={
              Array.isArray(profile.skills) ? profile.skills.join(", ") : ""
            }
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                skills: e.target.value.split(",").map((s) => s.trim()),
              }))
            }
            className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={isUpdating}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="animate-spin" />
              <span>Updating...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span>Update Profile</span>
              <CheckCircle className="w-5 h-5" />
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default Profile;
