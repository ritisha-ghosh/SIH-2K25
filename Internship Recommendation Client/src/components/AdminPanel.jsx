import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash, Loader2, Frown, Sparkles } from "lucide-react";

const AdminPanel = ({ token, onMessage }) => {
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/internships/all",
          {
            headers: { "x-auth-token": token },
          }
        );
        setInternships(res.data);
      } catch (err) {
        onMessage(
          err.response?.data?.msg || "Failed to fetch internships for admin."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchInternships();
  }, [token, onMessage]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this internship?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/internships/${id}`, {
        headers: { "x-auth-token": token },
      });
      setInternships((prev) => prev.filter((i) => i._id !== id));
      onMessage("Internship deleted successfully.");
    } catch (err) {
      onMessage(err.response?.data?.msg || "Failed to delete internship.");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner">
        <Loader2 className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400">
          Loading admin panel...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 animate-fadeIn">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Admin Panel
        </h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="w-4 h-4" />
          <span>Add New</span>
        </button>
      </div>
      {internships.length > 0 ? (
        <div className="space-y-4">
          {internships.map((internship) => (
            <div
              key={internship._id}
              className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-md"
            >
              <div>
                <h4 className="font-bold text-lg">{internship.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {internship.sector} - {internship.location}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-blue-500 hover:text-blue-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(internship._id)}
                  className="p-2 text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner">
          <Frown className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">
            No internships found.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
