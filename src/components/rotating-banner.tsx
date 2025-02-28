import { useState, useEffect } from 'react';
import { Carousel } from 'antd';

export default function RotatingBanner() {

    // Attributes
    const bannerGifs = [
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExemt0d2RqMjA4YnF3bXFwdWlvNWUxNGhrbjBkc2VkOWcyMWJ4ZmVyYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fqHC1tthIa4mvQmlIl/giphy.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnhnMzNkeXB0bjd4Y2lzemg1Z3F0MGp2bmt6dm5jdWFscHBoc253ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/v4LqB7I8P14HWeaa4i/giphy.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnRoNWVwaXZuY2Z3NGdoM2Y2cWZwY241bXU5ZXh5OWM3OHRqdDk0dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BPToIQ8OzqIdY6WNSW/giphy.gif',
        'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjVrb3p0c3F6N2c3eGVzeGFxYnR6OGVzOXdoYnY1ZXJqOWdpeGpyMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/B59TrKJQ3iPUYiZ4gS/giphy.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXhmbnpqdjJ2anV0cm11Z29nNzN4Y3dvNjdhODBiZHFjcmtkOGZudyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kEHKAkTK1nyu1BPLvb/giphy.gif',
    ];

    // UseState & UseEffect
    const [, setCurrentGif] = useState(0);
    useEffect(() => { // interval for alterning gifs
        const interval = setInterval(() => {
        setCurrentGif((prev) => (prev + 1) % bannerGifs.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [bannerGifs.length]);

    // Return
    return (
        <div className="w-full h-64 md:h-80 lg:h-96 relative overflow-hidden">

            <div className="absolute w-40 h-40 bg-white opacity-0 rounded-full blur-xl pointer-events-none mix-blend-overlay group-hover:opacity-20 transition-opacity duration-300 ease-in-out" 
                style={{ 
                    transform: 'translate(-50%, -50%)', 
                    left: 'var(--mouse-x, 50%)', 
                    top: 'var(--mouse-y, 50%)' 
                }}></div>
        
            <Carousel autoplay autoplaySpeed={5000} effect="fade" dots={false} className="absolute inset-0 w-full h-full"> {/* AntD Carousel with fade effect */}
                {bannerGifs.map((gif, index) => (
                <div key={index} className="h-64 md:h-80 lg:h-96 w-full bg-gray-800">
                    <img src={gif} alt={`MotoGP scene ${index+1}`} className="w-full h-full object-cover opacity-70" />
                </div>
                ))}
            </Carousel>
            
            <div className="absolute inset-0 flex items-center justify-center"> {/* Div card for central text */}
                <div className="relative z-10 bg-black bg-opacity-60 rounded-lg p-6 backdrop-blur-sm">
                    <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">MotoGP Results Manager</h1>
                    <p className="text-white text-sm md:text-base mb-5">Track, analyze and visualize racing performance at lightning speed</p>
                    <div className="flex justify-center">
                        <button className="px-4 py-2 bg-gradient-to-r from-[#D50000] to-[#FF1744] hover:opacity-90 hover:scale-105 transition text-white font-medium rounded-full">Get started!</button>
                    </div>
                </div>
            </div>

        </div>
    );
};