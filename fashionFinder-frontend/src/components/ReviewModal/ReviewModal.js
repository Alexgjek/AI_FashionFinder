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
                //setSubmitted(true);
                // Close the modal after submission
                onClose(true);
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
            <div className="py-6 border w-1/3 rounded-md bg-white pt-2 pb-2">
                <div className="text-center">
                    <div className="mt-2">
                        <h1 className='text-2xl font-semibold mb-1'>
                            Review
                        </h1>
                        <div className='flex items-center justify-center'>
                            <Rating
                                onClick={handleRating}
                                allowFraction={false}
                                SVGstyle={{ display: 'inline-block' }}
                                allowHover={false}
                                size={calculateStarSize()}
                            />
                        </div>
                        <textarea
                            rows={5}
                            style={{ height: "100px" }}
                            className="p-4 outline-none z-10 bg-transparent border border-gray-300 resize-none mt-3 mb-3 w-2/3"
                            placeholder="Leave a review!"
                            maxLength={74}
                            minLength={10}
                            value={ratingComment}
                            onChange={e => setRatingComment(e.target.value)}></textarea>
                        <div className="flex gap-2 items-center justify-center">
                            <button className='bg-black text-white font-semibold py-2 px-4 rounded' onClick={handleSubmitRating}>Submit</button>
                            <button className='bg-gray-300 text-black font-semibold py-2 px-4 rounded' onClick={handleCancel}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


function calculateStarSize() {
    if (window.innerWidth < 768) {
        return 20; 
    } else {
        return 40; 
    }
}