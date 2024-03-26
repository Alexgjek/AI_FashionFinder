import { useState } from 'react';
import axios from 'axios';
import { Rating } from 'react-simple-star-rating'

export default function ReviewModal({ onClose }) {

    const [rating, setRating] = useState(0);
    const [ratingComment, setRatingComment] = useState('');

    function handleRating(rate) {
        setRating(rate);
    }

    async function handleSubmitRating() {
        try {
            const userInfoResponse = await axios.get('http://localhost:3000/api/users/userInfo');
            const userInfo = userInfoResponse.data;
            const response = await axios.post('http://localhost:8000/saveReview', {
                userEmail: userInfo['email'],
                rating: rating,
                comment: ratingComment
            });
            const respJson = response.data;
            console.log(respJson);
            if (respJson.length > 0) {
                // Close the modal after submission
                onClose();
            }
        } catch (error) {
            console.error('Error fetching AI response:', error);
        }
    };

    function handleCancel() {
        // Close the modal on cancel
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
                <div className="text-center">
                    <div className="mt-2 px-7 py-3">
                        <div className='flex items-center justify-center'>
                            <Rating
                                onClick={handleRating}
                                allowFraction={false}
                                SVGstyle={{ display: 'inline-block' }}
                                allowHover={false}
                            />
                        </div>
                        <textarea
                            rows={5}
                            style={{ height: "100px" }}
                            className="p-4 outline-none z-10 bg-transparent border border-gray-300 resize-none"
                            placeholder="Leave a review!"
                            value={ratingComment}
                            onChange={e => setRatingComment(e.target.value)}></textarea>
                        <div className="flex gap-2 items-center justify-center">
                            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleSubmitRating}>Submit</button>
                            {/* Pass handleCancel function to the onClick event */}
                            <button className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded' onClick={handleCancel}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
