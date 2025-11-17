import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';
import useAuthStore from '../stores/authStore';
import { validateEmail, validateIranPhone, validatePassword, validateName, normalizeIranPhone } from '../utils/validators';

const Register = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.password || !formData.confirmPassword) {
      toast.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    if (!validateName(formData.firstName)) {
      toast.error('نام باید حداقل 2 کاراکتر باشد');
      return;
    }

    if (!validateName(formData.lastName)) {
      toast.error('نام خانوادگی باید حداقل 2 کاراکتر باشد');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('فرمت ایمیل صحیح نیست');
      return;
    }

    if (!validateIranPhone(formData.phoneNumber)) {
      toast.error('فرمت شماره تلفن صحیح نیست (09xxxxxxxxx یا +989xxxxxxxxx)');
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error('رمز عبور باید حداقل 8 کاراکتر باشد');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('رمز عبور و تکرار آن یکسان نیستند');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: normalizeIranPhone(formData.phoneNumber),
        password: formData.password,
      });

      setAuth(response.user, response.token);
      toast.success('ثبت‌نام با موفقیت انجام شد!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'خطا در ثبت‌نام');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg px-4 py-12">
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

        {/* Register Form */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg p-8 border border-light-border dark:border-dark-border">
          <h2 className="text-2xl font-bold text-center text-light-text dark:text-dark-text mb-6">
            ثبت‌نام
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                نام
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                placeholder="نام خود را وارد کنید"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                نام خانوادگی
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                placeholder="نام خانوادگی خود را وارد کنید"
                required
              />
            </div>

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

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                شماره تلفن
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                placeholder="09xxxxxxxxx"
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
                placeholder="حداقل 8 کاراکتر"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                تکرار رمز عبور
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                placeholder="رمز عبور را مجدداً وارد کنید"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {isLoading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link
                to="/login"
                className="text-primary-600 dark:text-primary-500 hover:underline font-medium"
              >
                ورود
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
