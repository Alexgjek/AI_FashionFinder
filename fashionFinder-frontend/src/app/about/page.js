'use client';
import Header from "@/components/Header";
import { Rating } from "react-simple-star-rating";
import { useState, useEffect, componentDidMount } from 'react';
import axios from 'axios';

export default function AboutPage() {

  const [ratingComments, setRatingComments] = useState([]);

  useEffect(() => {
    console.log("Fetching...")
    fetchRatingComments();
  }, []);

  // fetch reviews
  async function fetchRatingComments() {
    try {
      const response = await axios.get('http://localhost:8000/getReviews');
      console.log(response.data.reviews);
      setRatingComments(response.data.reviews);
    }
    catch (error) {
      console.error('Error fetching rating comments:', error);
    }
  }


  return (
    <main>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center pt-4">About FashionFinder</h1>
        <img src="/FFlogo.png" className="float-left pr-12 pl-2" />
        <div className="text-2xl text-gray-1500">
          <p className="mt-0 pt-44 pr-5 pb-24">
            Our AI-powered personal designer utilizes advanced algorithms to analyze user preferences. We aim to revolutionize the online shopping experience, offering tailored recommendations that align with each user's unique tastes and preferences.
          </p>
        </div>
      </div>
      <p className="text-white">.</p>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center pt-4 pb-6">How to Use FashionFinder?</h1>
        <div className="text-2xl text-gray-1500">
          <iframe class="w-3/4 mx-auto aspect-video md:aspect-autp pb-6" src="https://www.youtube.com/..."></iframe>
        </div>
      </div>


      <div className="pl-20 pb-10">
        <h1 className="text-3xl font-bold text-center pt-4 pb-6">Take a Look at Some of Our Reviews!</h1>
        <div class="w-full overflow-x-auto snap-mandatory">
          <ul className="flex gap-4">
            {ratingComments.map((review, index) => (
              <li key={index} className="bg-gray-300 p-10">
                {review.user.firstName}&nbsp;{review.user.lastName}
                <Rating
                    key={index}
                    initialValue={review.rating}
                    readonly={true}
                    allowFraction={false}
                    SVGstyle={{ display: 'inline-block' }}
                    allowHover={false}
                  />
                {review.comment}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}



