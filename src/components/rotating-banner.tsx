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
        <div className="w-full h-screen relative overflow-hidden">
            <Carousel autoplay autoplaySpeed={5000} effect="fade" dots={false} className="absolute inset-0 w-full h-full">
                {bannerGifs.map((gif, index) => (
                    <div key={index} className="h-screen w-full bg-gray-900">
                        <div className="absolute inset-0 bg-black bg-opacity-50" /> {/* Overlay para mejor contraste */}
                        <img src={gif} alt={`MotoGP scene ${index+1}`} className="w-full h-full object-cover opacity-70" />
                    </div>
                ))}
            </Carousel>
           
            <div className="absolute inset-0 flex items-center justify-center px-4" style={{ paddingBottom: '8rem' }}>
                <div className="relative z-10 bg-black bg-opacity-60 rounded-lg p-6 md:p-8 backdrop-blur-sm max-w-xl mx-auto">
                    <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-center">MotoGP Results Manager</h1>
                    <p className="text-white text-sm md:text-lg mb-6 text-center">Track, analyze and visualize racing performance at lightning speed</p>
                    <div className="flex justify-center">
                        <button className="px-6 py-3 bg-gradient-to-r from-[#D50000] to-[#FF1744] hover:opacity-90 hover:scale-105 transition-all duration-300 text-white font-medium rounded-full shadow-lg">Get started!</button>
                    </div>
                </div>
            </div>
        </div>
    );
}