import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Any other initializations or API calls can go here
  }, []);

  return (
    <div className="home p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Welcome to the Advanced Media Library</h1>
      
      {error && <p className="error text-red-600 mb-4" role="alert">{error}</p>}

      {/* Featured Media Section with 6 items and reduced size */}
      <div className="featured-media mb-12 mt-8"> {/* Reduced margin-top */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Featured Media</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6"> {/* 6 items in a 2/3/3 grid */}
          <div className="featured-item bg-white p-4 rounded-lg shadow hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Book Title 1</h3> {/* Reduced font size */}
            <p className="text-gray-700 text-sm mb-2">A brief description of the featured book or media item. This could be a popular book, video, or journal.</p>
            <Link to="/search" className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300">Explore</Link>
          </div>
          <div className="featured-item bg-white p-4 rounded-lg shadow hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Book Title 2</h3> {/* Reduced font size */}
            <p className="text-gray-700 text-sm mb-2">A brief description of another featured media item. It could be a highly recommended video or audio content.</p>
            <Link to="/search" className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300">Explore</Link>
          </div>
          <div className="featured-item bg-white p-4 rounded-lg shadow hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Book Title 3</h3> {/* Reduced font size */}
            <p className="text-gray-700 text-sm mb-2">Description of the third featured media item. This section can highlight different media types (books, videos, etc.).</p>
            <Link to="/search" className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300">Explore</Link>
          </div>
          <div className="featured-item bg-white p-4 rounded-lg shadow hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Book Title 4</h3> {/* Reduced font size */}
            <p className="text-gray-700 text-sm mb-2">Description of the fourth featured media item. This could be a popular video or journal.</p>
            <Link to="/search" className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300">Explore</Link>
          </div>
          <div className="featured-item bg-white p-4 rounded-lg shadow hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Book Title 5</h3> {/* Reduced font size */}
            <p className="text-gray-700 text-sm mb-2">A brief description of another highly-rated media item.</p>
            <Link to="/search" className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300">Explore</Link>
          </div>
          <div className="featured-item bg-white p-4 rounded-lg shadow hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Book Title 6</h3> {/* Reduced font size */}
            <p className="text-gray-700 text-sm mb-2">Description of the sixth featured media item. This section can highlight different media types (books, videos, etc.).</p>
            <Link to="/search" className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300">Explore</Link>
          </div>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="get-started bg-blue-600 text-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-semibold mb-4">Get Started with AML</h2>
        <p className="text-lg mb-6">
          Ready to explore a world of media? Start browsing, borrow, or learn with our extensive collection of books, videos, and audio.
        </p>
        <Link to="/search" className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-full text-white text-lg transition duration-300">
          Browse Now
        </Link>
      </div>

      {/* About Section */}
      <div className="about-section bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow mt-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">About AML</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          The Advanced Media Library (AML) is a state-of-the-art digital library system that provides access to a wide range of media including books, journals, audio, and video content. We aim to make knowledge accessible to everyone, anytime, anywhere.
        </p>
      </div>
    </div>
  );
};

export default Home;
