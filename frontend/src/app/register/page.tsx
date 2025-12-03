'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import apiService from '@/app/services/apiServices';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password1 !== formData.password2) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password1.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.postWithoutToken('/api/auth/register/', {
        name: formData.name,
        email: formData.email,
        password1: formData.password1,
        password2: formData.password2,
      });

      if (response.user) {
        // Registration successful, redirect to login
        router.push('/login?registered=true');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err: any) {
      if (err.response?.data) {
        // Handle specific error messages from backend
        const errors = err.response.data;
        if (errors.name) {
          setError(`Name: ${errors.name[0]}`);
        } else if (errors.email) {
          setError(`Email: ${errors.email[0]}`);
        } else if (errors.password1) {
          setError(`Password: ${errors.password1[0]}`);
        } else if (errors.password2) {
          setError(`Password confirmation: ${errors.password2[0]}`);
        } else if (errors.non_field_errors) {
          setError(errors.non_field_errors[0]);
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        setError('Registration failed. Please check your information and try again.');
      }
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-dark to-brand-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <Image
                src="/invoice.png"
                alt="Invoqube logo"
                width={40}
                height={40}
              />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-accent">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-accent-light">
            Start managing your invoices today
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-base-white rounded-lg shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand mb-2">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-brand focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-brand focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="password1" className="block text-sm font-medium text-brand mb-2">
                Password
              </label>
              <input
                id="password1"
                name="password1"
                type="password"
                required
                value={formData.password1}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-brand focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label htmlFor="password2" className="block text-sm font-medium text-brand mb-2">
                Confirm Password
              </label>
              <input
                id="password2"
                name="password2"
                type="password"
                required
                value={formData.password2}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-brand focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Re-enter your password"
              />
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 mt-1 text-accent focus:ring-accent border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-brand">
                I agree to the{' '}
                <a href="#" className="text-accent hover:text-accent-dark">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-accent hover:text-accent-dark">
                  Privacy Policy
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-brand bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-accent-light disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-accent hover:text-accent-dark">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Why Invoqube?</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="ml-3 text-sm text-gray-600">Easy invoice creation and management</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="ml-3 text-sm text-gray-600">Track payments and overdue invoices</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="ml-3 text-sm text-gray-600">Powerful analytics and insights</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
