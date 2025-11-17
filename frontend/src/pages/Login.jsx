import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';
import useAuthStore from '../stores/authStore';
import { validateEmail } from '../utils/validators';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password) {
      toast.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('فرمت ایمیل صحیح نیست');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      setAuth(response.user, response.token);
      toast.success('خوش آمدید!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'خطا در ورود به سیستم');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-500 mb-2">
            سَروِ
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            مدیریت وظایف هوشمند
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg p-8 border border-light-border dark:border-dark-border">
          <h2 className="text-2xl font-bold text-center text-light-text dark:text-dark-text mb-6">
            ورود به حساب کاربری
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                ایمیل
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                placeholder="example@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                رمز عبور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                placeholder="رمز عبور خود را وارد کنید"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {isLoading ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              حساب کاربری ندارید؟{' '}
              <Link
                to="/register"
                className="text-primary-600 dark:text-primary-500 hover:underline font-medium"
              >
                ثبت‌نام کنید
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
