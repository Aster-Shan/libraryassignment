import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface MediaItem {
    id: string;
    title: string;
    description: string;
}

const Home: React.FC = () => {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('/api/media/all',{
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                const allMedia: MediaItem[] = response.data;

                // Shuffle the array and pick the first six items
                const shuffledMedia = allMedia.sort(() => Math.random() - 0.5);
                const randomMedia = shuffledMedia.slice(0, 6);

                setMedia(randomMedia);
            } catch (err) {
                setError('Failed to fetch media. Please try again later.');
            }
        };

        fetchMedia();
    }, []);

    return (
        <div className="home p-6 max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Welcome to the Advanced Media Library</h1>

            {error && <p className="error text-red-600 mb-4" role="alert">{error}</p>}

            {/* Featured Media Section */}
            <div className="featured-media mb-12 mt-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Featured Media</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
                    {media.map((item) => (
                        <div key={item.id} className="featured-item bg-white p-4 rounded-lg shadow hover:shadow-xl transition-shadow">
                            <h3 className="text-sm font-semibold text-gray-800 mb-2">{item.title}</h3>
                            <p className="text-gray-700 text-sm mb-2">{item.description || 'No description available.'}</p>
                            <Link to={`/search`} className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300">Explore</Link>
                        </div>
                    ))}
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
