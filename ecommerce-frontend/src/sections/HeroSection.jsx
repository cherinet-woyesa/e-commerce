import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { RiFlashlightFill } from 'react-icons/ri';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      title: "Discover Your Perfect Style",
      subtitle: "Shop the latest trends with our curated collection",
      cta: "Shop Now",
      secondaryCta: "New Arrivals",
      discount: "25% Off",
      image: "land.avif",
      bgGradient: "from-purple-600 to-blue-600"
    },
    {
      title: "Summer Collection 2023",
      subtitle: "Fresh styles for the sunny season ahead",
      cta: "Explore Collection",
      secondaryCta: "View Lookbook",
      discount: "Free Shipping",
      image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=800&q=80",
      bgGradient: "from-amber-500 to-pink-500"
    },
    {
      title: "Tech Innovation",
      subtitle: "Cutting-edge gadgets at unbeatable prices",
      cta: "Browse Electronics",
      secondaryCta: "Limited Offers",
      discount: "Up to 40% Off",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      bgGradient: "from-indigo-600 to-blue-800"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`hero-section relative h-[90vh] min-h-[600px] overflow-hidden transition-all duration-1000 bg-gradient-to-r ${heroSlides[currentSlide].bgGradient}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-white blur-xl animate-float-delay"></div>
      </div>
      
      {/* Content container */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            {/* Text content */}
            <div className="space-y-6 z-10">
              <div className="flex items-center gap-3 mb-4">
                <RiFlashlightFill className="text-yellow-300 text-2xl animate-pulse" />
                <span className="text-sm font-semibold tracking-wider text-white/90">
                  {heroSlides[currentSlide].discount}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                {heroSlides[currentSlide].title}
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-lg">
                {heroSlides[currentSlide].subtitle}
              </p>
              
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/products"
                  className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 group"
                >
                  {heroSlides[currentSlide].cta}
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/new-arrivals"
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-white/20 border border-white/20 transition-all duration-300 group"
                >
                  {heroSlides[currentSlide].secondaryCta}
                  <FiShoppingBag className="group-hover:scale-110 transition-transform" />
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-10 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <img 
                        key={i} 
                        src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i+20}.jpg`} 
                        className="w-8 h-8 rounded-full border-2 border-white" 
                        alt="Customer" 
                      />
                    ))}
                  </div>
                  <span>10K+ Happy Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Free Shipping Worldwide</span>
                </div>
              </div>
            </div>
            
            {/* Image content */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[500px]">
                {heroSlides.map((slide, index) => (
                  <div 
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <img 
                      src={slide.image} 
                      alt="Hero product" 
                      className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white/10"
                    />
                    <div className="absolute -top-4 -right-4 bg-white p-3 rounded-full shadow-xl animate-bounce">
                      <span className="text-sm font-bold text-purple-600">{slide.discount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delay { animation: float 8s ease-in-out infinite 2s; }
      `}</style>
    </section>
  );
};

export default HeroSection;