import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  User, Lock, Eye, EyeOff, Mail, Phone, Calendar, MapPin,
  GraduationCap, Building, ArrowRight, UserPlus, LogIn,
  Sparkles, Shield, CheckCircle, AlertCircle, ChevronRight, ChevronLeft
} from 'lucide-react';

const AuthForm = ({ onAuthSuccess, onMessage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '', password: '', email: '', phone: '', fullName: '',
    dateOfBirth: '', location: '', education: '', university: '',
    graduationYear: '', fieldOfStudy: '', skills: '', experience: '',
    linkedIn: '', github: '', portfolio: '', bio: '', interests: '',
    preferredLocation: '', expectedSalary: '', availability: '',
    workType: 'remote'
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});
  const [formMessage, setFormMessage] = useState('');
  const formRef = useRef(null);

  // All data lists are now defined here at the top level of the component
  const educationOptions = [
    'High School Diploma', 'Associate Degree', 'Bachelor of Technology (B.Tech)',
    'Bachelor of Engineering (B.E.)', 'Bachelor of Science (B.Sc)',
    'Bachelor of Computer Applications (BCA)', 'Bachelor of Business Administration (BBA)',
    'Bachelor of Commerce (B.Com)', 'Bachelor of Arts (B.A.)', 'Master of Technology (M.Tech)',
    'Master of Engineering (M.E.)', 'Master of Science (M.Sc)',
    'Master of Computer Applications (MCA)', 'Master of Business Administration (MBA)',
    'Master of Commerce (M.Com)', 'Master of Arts (M.A.)', 'Doctor of Philosophy (PhD)',
    'Diploma in Engineering', 'Polytechnic Diploma', 'Certificate Course', 'Other'
  ];
  const fieldOfStudyOptions = [
    'Computer Science & Engineering', 'Information Technology', 'Software Engineering',
    'Data Science', 'Artificial Intelligence', 'Machine Learning', 'Cybersecurity',
    'Electronics & Communication', 'Electrical Engineering', 'Mechanical Engineering',
    'Civil Engineering', 'Chemical Engineering', 'Biotechnology', 'Business Administration',
    'Marketing', 'Finance', 'Accounting', 'Human Resources', 'Economics', 'Psychology',
    'Graphic Design', 'UI/UX Design', 'Digital Marketing', 'Content Writing', 'Mathematics',
    'Statistics', 'Physics', 'Chemistry', 'Biology', 'Environmental Science', 'Other'
  ];
  const skillsOptions = [
    'Python', 'JavaScript', 'Java', 'C++', 'C#', 'C', 'HTML5', 'CSS3', 'React',
    'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Next.js', 'Bootstrap',
    'Tailwind CSS', 'Sass', 'Less', 'MySQL', 'PostgreSQL', 'MongoDB', 'AWS',
    'Microsoft Azure', 'Google Cloud Platform', 'Docker', 'Kubernetes', 'Jenkins',
    'Git', 'GitHub', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
    'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Power BI',
    'Tableau', 'Excel', 'React Native', 'Flutter', 'iOS Development', 'Android Development',
    'Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Sketch', 'UI/UX Design',
    'Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing', 'Content Marketing',
    'Google Analytics', 'Project Management', 'Agile', 'Scrum', 'API Development',
    'REST APIs', 'GraphQL', 'Microservices', 'Blockchain'
  ];
  const locationOptions = [
    'Remote', 'Hybrid', 'Mumbai, India', 'Delhi, India', 'Bangalore, India',
    'Hyderabad, India', 'Chennai, India', 'Kolkata, India', 'Pune, India',
    'Ahmedabad, India', 'Jaipur, India', 'Surat, India', 'New York, NY',
    'San Francisco, CA', 'Los Angeles, CA', 'Seattle, WA', 'Boston, MA',
    'Austin, TX', 'Chicago, IL', 'London, UK', 'Berlin, Germany', 'Paris, France',
    'Singapore', 'Tokyo, Japan', 'Sydney, Australia', 'Melbourne, Australia',
    'Toronto, Canada', 'Vancouver, Canada', 'Other'
  ];
  const workTypeOptions = [
    { value: 'remote', label: 'Remote Only' },
    { value: 'onsite', label: 'On-site Only' },
    { value: 'hybrid', label: 'Hybrid' }
  ];
  const experienceOptions = [
    'No Experience', 'Less than 1 year', '1-2 years', '2-3 years',
    '3-5 years', 'More than 5 years'
  ];
  const availabilityOptions = [
    'Immediately', 'Within 1 week', 'Within 2 weeks', 'Within 1 month',
    '1-2 months', '2-3 months', 'More than 3 months', 'Flexible'
  ];
  const interestsOptions = [
    'IT', 'Finance', 'Tech', 'Security', 'Design', 'Marketing', 'Healthcare',
    'Education', 'E-commerce', 'Automotive', 'Manufacturing', 'Consulting',
    'Research & Development', 'Biotechnology'
  ];


  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    if (step === 1) {
      if (!formData.username.trim()) errors.username = 'Username is required';
      if (!formData.password.trim()) errors.password = 'Password is required';
      if (!isLogin) {
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
      }
    } else if (step === 2 && !isLogin) {
      if (!formData.education) errors.education = 'Education is required';
      if (!formData.fieldOfStudy) errors.fieldOfStudy = 'Field of study is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setFormMessage('');
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    setCurrentStep(prev => prev - 1);
    setFormMessage('');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!isLogin && !validateStep(currentStep)) return;
    
    setIsLoading(true);
    setFormMessage('');

    try {
      const endpoint = isLogin ? 'login' : 'register';
      
      const payload = isLogin
        ? { username: formData.username, password: formData.password }
        : {
            ...formData,
            skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
          };
      
      const response = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, payload);
      
      onAuthSuccess(response.data.token, response.data.user.username, response.data.user.isAdmin);
      
    } catch (err) {
      setFormMessage(err.response?.data?.msg || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className={`w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 ${validationErrors.username ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'} rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all`}
            placeholder="Enter your username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
          />
          {validationErrors.username && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          )}
        </div>
        {validationErrors.username && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{validationErrors.username}</p>
        )}
      </div>

      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            className={`w-full pl-12 pr-12 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 ${validationErrors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-600'} rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all`}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {validationErrors.password && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{validationErrors.password}</p>
        )}
      </div>
    </div>
  );

  const renderRegistrationStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            className={`w-full pl-4 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 ${validationErrors.fullName ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'} rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all`}
            placeholder="Your full name"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
          />
          {validationErrors.fullName && (
            <p className="mt-1 text-xs text-red-600">{validationErrors.fullName}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Username *
          </label>
          <input
            type="text"
            className={`w-full pl-4 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 ${validationErrors.username ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'} rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all`}
            placeholder="Choose a username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
          />
          {validationErrors.username && (
            <p className="mt-1 text-xs text-red-600">{validationErrors.username}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Email *
          </label>
          <input
            type="email"
            className={`w-full pl-4 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 ${validationErrors.email ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'} rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all`}
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
          {validationErrors.email && (
            <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full pl-4 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
      </div>
      
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Password *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className={`w-full pl-4 pr-12 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 ${validationErrors.password ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'} rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all`}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {validationErrors.password && (
          <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
        )}
      </div>
    </div>
  );

  const renderRegistrationStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Education Level *
          </label>
          <select
            className={`w-full pl-4 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 ${validationErrors.education ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'} rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all appearance-none`}
            value={formData.education}
            onChange={(e) => handleInputChange('education', e.target.value)}
          >
            <option value="">Select education level</option>
            {educationOptions.map(edu => (
              <option key={edu} value={edu}>{edu}</option>
            ))}
          </select>
          {validationErrors.education && (
            <p className="mt-1 text-xs text-red-600">{validationErrors.education}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Field of Study *
          </label>
          <select
            className={`w-full pl-4 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 ${validationErrors.fieldOfStudy ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'} rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all appearance-none`}
            value={formData.fieldOfStudy}
            onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
          >
            <option value="">Select field of study</option>
            {fieldOfStudyOptions.map(field => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
          {validationErrors.fieldOfStudy && (
            <p className="mt-1 text-xs text-red-600">{validationErrors.fieldOfStudy}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            University/Institution
          </label>
          <input
            type="text"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all"
            placeholder="Your university or institution"
            value={formData.university}
            onChange={(e) => handleInputChange('university', e.target.value)}
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Graduation Year
          </label>
          <input
            type="number"
            min="2020" max="2030"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all"
            placeholder="2024"
            value={formData.graduationYear}
            onChange={(e) => handleInputChange('graduationYear', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderRegistrationStep3 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            LinkedIn Profile
          </label>
          <input
            type="url"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all"
            placeholder="https://linkedin.com/in/yourprofile"
            value={formData.linkedIn}
            onChange={(e) => handleInputChange('linkedIn', e.target.value)}
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            GitHub Profile
          </label>
          <input
            type="url"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all"
            placeholder="https://github.com/yourusername"
            value={formData.github}
            onChange={(e) => handleInputChange('github', e.target.value)}
          />
        </div>
      </div>
      
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Skills (Comma-separated)
        </label>
        <input
          type="text"
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all"
          placeholder="Type to search skills (e.g., Python, React, SQL)..."
          value={formData.skills}
          onChange={(e) => handleInputChange('skills', e.target.value)}
          list="skillsList"
        />
        <datalist id="skillsList">
          {skillsOptions.map(skill => (<option key={skill} value={skill} />))}
        </datalist>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Experience Level
          </label>
          <select
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all appearance-none"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
          >
            <option value="">Select experience level</option>
            {experienceOptions.map(exp => (<option key={exp} value={exp}>{exp}</option>))}
          </select>
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Areas of Interest
          </label>
          <input
            type="text"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-blue-500 transition-all"
            placeholder="e.g., Machine Learning, Web Dev"
            value={formData.interests}
            onChange={(e) => handleInputChange('interests', e.target.value)}
            list="interestsOptions"
          />
          <datalist id="interestsOptions">
            {interestsOptions.map(opt => (<option key={opt} value={opt} />))}
          </datalist>
        </div>
      </div>
    </div>
  );

  const renderStepIndicator = () => {
    if (isLogin) return null;
    const steps = ['Basic Info', 'Education', 'Preferences'];
    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-3">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                  index + 1 === currentStep
                    ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                    : index + 1 < currentStep
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-400'
                }`}>
                  {index + 1 < currentStep ? (<CheckCircle className="w-4 h-4" />) : (<span>{index + 1}</span>)}
                </div>
                <span className={`mt-1 text-xs font-medium text-center ${
                  index + 1 === currentStep
                    ? 'text-blue-600 dark:text-blue-400'
                    : index + 1 < currentStep
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-400'
                }`}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-10 h-0.5 ${
                  index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl mb-4 shadow-2xl">
            {isLogin ? <LogIn className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {isLogin ? 'Welcome Back!' : 'Join InternshipHub'}
          </h1>
          <p className="text-md text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
            {isLogin 
              ? 'Sign in to discover amazing internship opportunities'
              : 'Create your profile and unlock thousands of internship opportunities'
            }
          </p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8">
          {formMessage && (
            <div className="mb-4 animate-fadeIn">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg shadow-sm backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-700 dark:text-red-300 font-medium text-xs">{formMessage}</p>
                </div>
              </div>
            </div>
          )}
          <form ref={formRef} onSubmit={e => e.preventDefault()}>
            {isLogin && renderLoginForm()}
            {!isLogin && currentStep === 1 && renderRegistrationStep1()}
            {!isLogin && currentStep === 2 && renderRegistrationStep2()}
            {!isLogin && currentStep === 3 && renderRegistrationStep3()}

            <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
              {!isLogin && currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all transform hover:scale-105"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              )}
              
              <div className="flex-1"></div>
              
              {isLogin && (
                <button
                  type="submit"
                  onClick={handleAuth}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </button>
              )}
              
              {!isLogin && currentStep < 3 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              
              {!isLogin && currentStep === 3 && (
                <button
                  type="button"
                  onClick={handleAuth}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setCurrentStep(1);
                  setValidationErrors({});
                  setFormMessage('');
                }}
                className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  isLogin
                    ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setCurrentStep(1);
                  setValidationErrors({});
                  setFormMessage('');
                }}
                className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  !isLogin
                    ? 'bg-white dark:bg-gray-800 text-purple-600 shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Your information is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;