'use client'
import emailjs from 'emailjs-com';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value.replace(/[^A-Za-z]/ig, ''); 
    setFormData(prevState => ({
      ...prevState,
      [name]: sanitizedValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setFormError('Please fill in all fields.');
      return;
    }
    emailjs.sendForm('service_znx1zwu', 'template_cq89pfq', e.target, 'UHSSbPh-j0hEtzASh')
      .then((result) => {
        console.log('Email sent successfully:', result.text);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          message: ''
        });
        setSuccessMessage('Your message has been sent successfully!');
        setErrorMessage('');
        setFormError('');
      })
      .catch((error) => {
        console.error('Failed to send email:', error.text);
        setErrorMessage('Failed to send message. Please try again later.');
        setSuccessMessage('');
      });
  };

  return (
    <main className="flex justify-center items-center mt-10">
      <div className="flex flex-col items-center bg-white p-8 rounded shadow-md w-full md:w-2/3 lg:w-1/2">
        <h3 className="text-3xl font-bold mb-4">CONTACT US</h3>

        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {formError && <p className="text-red-500">{formError}</p>}

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-600">
              Full Name*
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full p-2 mb-4 md:w-1/2 border border-gray-300 rounded"
              />
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full p-2 mb-4 md:w-1/2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email Address*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData(prevState => ({ ...prevState, email: e.target.value }))}
              placeholder="Email address"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-600">
              Message*
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={(e) => setFormData(prevState => ({ ...prevState, message: e.target.value }))}
              placeholder="Write your message"
              className="w-full p-2 border border-gray-300 rounded resize-none h-40"
            />
          </div>

          <button type="submit" className="bg-black text-white py-2 px-4 rounded hover:bg-gray-600">
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}