import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Users,
  Settings,
  Sparkles,
  Battery,
  Wifi,
} from "lucide-react";

interface Feature {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  color: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: "Lightning Fast Performance",
    description:
      "Experience blazing-fast speeds with our optimized algorithms and cutting-edge infrastructure. Load times reduced by up to 90% with intelligent caching and performance optimization.",
    image:
      "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: <Zap className="w-5 h-5" />,
    color: "from-amber-400 to-orange-500",
  },
  {
    id: 2,
    title: "Enterprise Security",
    description:
      "Bank-level encryption and security protocols protect your data. SOC 2 Type II certified with end-to-end encryption, multi-factor authentication, and advanced threat detection.",
    image:
      "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: <Shield className="w-5 h-5" />,
    color: "from-emerald-400 to-green-500",
  },
  {
    id: 3,
    title: "Team Collaboration",
    description:
      "Seamlessly work together with real-time collaboration features. Share, comment, and build together in perfect harmony with live editing and instant synchronization.",
    image:
      "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: <Users className="w-5 h-5" />,
    color: "from-blue-400 to-indigo-500",
  },
  {
    id: 4,
    title: "Smart Automation",
    description:
      "Intelligent workflows that adapt to your needs. AI-powered automation saves hours of manual work every week with predictive analytics and smart task management.",
    image:
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: <Settings className="w-5 h-5" />,
    color: "from-purple-400 to-pink-500",
  },
  {
    id: 5,
    title: "Advanced Analytics",
    description:
      "Gain deep insights with comprehensive analytics and reporting. Make data-driven decisions with confidence using real-time dashboards and predictive modeling.",
    image:
      "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: <Sparkles className="w-5 h-5" />,
    color: "from-cyan-400 to-teal-500",
  },
];

const FeatureShowcase: React.FC = () => {
  // state
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>("");

  // refs
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const featureRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rightListRef = useRef<HTMLDivElement | null>(null);

 
  const activeRef = useRef<number>(0);

 
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setCurrentTime(timeString);
    };
    updateTime();
    const id = setInterval(updateTime, 60_000);
    return () => clearInterval(id);
  }, []);

 
  useEffect(() => {
    let rafId: number | null = null;

    const onScroll = () => {
      if (!sectionRef.current) return;
      if (rafId !== null) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const node = sectionRef.current!;
        const rect = node.getBoundingClientRect();
        const totalHeight = node.offsetHeight;
        const viewportHeight = window.innerHeight || 1;
        const maxScroll = Math.max(totalHeight - viewportHeight, 1);
     
        const scrolled = Math.min(Math.max(-rect.top, 0), maxScroll);
        const progress = scrolled / maxScroll;
        setScrollProgress(progress);

      
        const lastIndex = features.length - 1;
        const idx = Math.round(progress * lastIndex);

        if (idx !== activeRef.current) {
          activeRef.current = idx;
          setActiveFeature(idx);
        }
      });
    };

 
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

 
  useEffect(() => {
    const el = featureRefs.current[activeFeature];
    const container = rightListRef.current;
    if (el && container) {

      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [activeFeature]);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevFeature();
      } else if (e.key === "ArrowRight") {
        nextFeature();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);

  }, []);

  // navigation helpers
  const nextFeature = () => {
    const next = (activeRef.current + 1) % features.length;
    activeRef.current = next;
    setActiveFeature(next);
   
  };

  const prevFeature = () => {
    const prev = (activeRef.current - 1 + features.length) % features.length;
    activeRef.current = prev;
    setActiveFeature(prev);
  };

  const handleFeatureClick = (index: number) => {
    activeRef.current = index;
    setActiveFeature(index);

    if (sectionRef.current) {
      const node = sectionRef.current;
      const totalHeight = node.offsetHeight;
      const viewportHeight = window.innerHeight || 1;
      const maxScroll = Math.max(totalHeight - viewportHeight, 1);
      const lastIndex = features.length - 1;
      const targetProgress = index / lastIndex;
      const targetScrolled = Math.round(targetProgress * maxScroll);
      const sectionTop = node.getBoundingClientRect().top + window.scrollY;
      const targetScrollY = sectionTop + targetScrolled;
      window.scrollTo({ top: targetScrollY, behavior: "smooth" });
    }
  };

  const currentFeature = features[activeFeature] ?? features[0];


  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ height: `${features.length * 100}vh` }}
    >
     
      <div className="sticky top-0 z-10 h-screen">
        <div className="max-w-7xl mx-auto px-4 h-full">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-center h-full">
            {/* Left Side */}
            <div className="col-span-4 space-y-6">
              <div className="transform transition-all duration-700 ease-out">
                {/* Feature Badge */}
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${currentFeature.color} text-white font-medium text-sm mb-6 shadow-lg`}
                >
                  {currentFeature.icon}
                  <span>
                    Feature {activeFeature + 1} of {features.length}
                  </span>
                </div>

                {/* Feature Title */}
                <h2 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
                  {currentFeature.title}
                </h2>

                {/* Feature Description */}
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  {currentFeature.description}
                </p>

                {/* Navigation Arrows */}
                <div className="flex gap-3">
                  <button
                    onClick={prevFeature}
                    className="group flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all hover:scale-105 active:scale-95"
                    aria-label="Previous feature"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                  </button>
                  <button
                    onClick={nextFeature}
                    className="group flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all hover:scale-105 active:scale-95"
                    aria-label="Next feature"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Center - iPhone Mockup */}
            <div className="col-span-4 flex justify-center">
              <div className="relative transform transition-all duration-700 ease-out hover:scale-105">
                {/* iPhone Frame */}
                <div className="relative w-72 h-[580px] bg-slate-900 rounded-[3.5rem] p-2 shadow-2xl">
                  {/* Screen */}
                  <div className="w-full h-full bg-black rounded-[3rem] overflow-hidden relative">
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-36 h-8 bg-black rounded-full z-20 shadow-inner"></div>

                    {/* Screen Content */}
                    <div className="w-full h-full relative overflow-hidden">
                      {/* Status Bar */}
                      <div className="absolute top-0 left-0 right-0 h-12 bg-black/20 backdrop-blur-sm z-30 flex items-center justify-between px-8 pt-2">
                        <div className="flex items-center gap-1 text-white text-sm font-medium">
                          <div className="flex gap-1">
                            <div className="w-1 h-3 bg-white rounded-full"></div>
                            <div className="w-1 h-3 bg-white rounded-full"></div>
                            <div className="w-1 h-3 bg-white/60 rounded-full"></div>
                            <div className="w-1 h-3 bg-white/40 rounded-full"></div>
                          </div>
                          <Wifi className="w-4 h-4 ml-2" />
                        </div>
                        <div className="text-white text-sm font-semibold">{currentTime}</div>
                        <div className="flex items-center gap-1 text-white">
                          <span className="text-sm font-medium">100%</span>
                          <Battery className="w-5 h-5 fill-current" />
                        </div>
                      </div>

                      {/* Feature Image + Overlay */}
                      <div className="absolute inset-0 transition-all duration-700">
                        <img
                          src={currentFeature.image}
                          alt={currentFeature.title}
                          className="w-full h-full object-cover transition-all duration-700"
                          key={currentFeature.id}
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-t ${currentFeature.color} opacity-30`}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      </div>

                      {/* App UI */}
                      <div className="absolute inset-0 flex flex-col">
                        <div className="h-16"></div>
                        <div className="p-6 flex flex-col justify-end">
                          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20">
                            <div
                              className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${currentFeature.color} flex items-center justify-center text-white mb-4`}
                            >
                              {currentFeature.icon}
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2">
                              {currentFeature.title}
                            </h3>
                            
                            <div className="text-sm text-white/800 leading-relaxed max-h-28 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-transparent">
                              {currentFeature.description}
                            </div>

                          
                            <div className="flex gap-1 mt-4">
                              {features.map((_, index) => (
                                <div
                                  key={index}
                                  className={`h-1 rounded-full transition-all ${
                                    index === activeFeature
                                      ? `bg-gradient-to-r ${currentFeature.color} w-8`
                                      : "bg-slate-300 w-2"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-36 h-1 bg-white/40 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Right Side - Feature List */}
            <div className="col-span-4 space-y-3">
              <div ref={rightListRef} className="space-y-3 max-h-[70vh]">
                {features.map((feature, index) => (
                  <button
                    key={feature.id}
                    ref={(el) => (featureRefs.current[index] = el)}
                    onClick={() => handleFeatureClick(index)}
                    aria-current={activeFeature === index ? "true" : undefined}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all group ${
                      activeFeature === index
                        ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg`}
                      >
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-bold text-base mb-1 ${
                            activeFeature === index ? "text-blue-900" : "text-slate-900"
                          }`}
                        >
                          {feature.title}
                        </h3>
                        <p
                          className={`text-sm line-clamp-2 ${
                            activeFeature === index ? "text-blue-700" : "text-slate-600"
                          }`}
                        >
                          {feature.description.substring(0, 80)}...
                        </p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full transition-all ${
                          activeFeature === index ? "bg-blue-500 animate-pulse" : "bg-slate-300 scale-0"
                        }`}
                      ></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

{/* Mobile Layout */}
<div className="lg:hidden flex flex-col justify-center space-y-6">
  {/* iPhone Mockup */}
  <div className="flex justify-center mb-2">  
    <div className="relative transform transition-all duration-700 ease-out">
      {/* iPhone Frame - Mobile Optimized */}
      <div className="relative w-56 h-[450px] bg-slate-900 rounded-[3rem] p-2 shadow-2xl">
        <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-black rounded-full z-20"></div>

          {/* Mobile Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-black/20 backdrop-blur-sm z-30 flex items-center justify-between px-6 pt-1">
            <div className="flex items-center gap-1 text-white text-xs">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-2 bg-white rounded-full"></div>
                <div className="w-0.5 h-2 bg-white rounded-full"></div>
                <div className="w-0.5 h-2 bg-white/60 rounded-full"></div>
                <div className="w-0.5 h-2 bg-white/40 rounded-full"></div>
              </div>
              <Wifi className="w-3 h-3 ml-1" />
            </div>
            <div className="text-white text-xs font-semibold">{currentTime}</div>
            <div className="flex items-center gap-1 text-white">
              <span className="text-xs">100%</span>
              <Battery className="w-3 h-3 fill-current" />
            </div>
          </div>

          {/* Feature Image + Overlay */}
          <div className="w-full h-full relative overflow-hidden">
            <div
              key={currentFeature.id}
              className="absolute inset-0 transition-all duration-700"
            >
              <img
                src={currentFeature.image}
                alt={currentFeature.title}
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${currentFeature.color} opacity-30 transition-all duration-700`}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col">
              <div className="h-12"></div>
              <div className="flex-1 p-4 flex flex-col justify-end">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-r ${currentFeature.color} flex items-center justify-center text-white mb-3 shadow-lg`}
                  >
                    <div className="scale-75">{currentFeature.icon}</div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-2">
                    {currentFeature.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-h-20 overflow-y-auto pr-2">
                    {currentFeature.description}
                  </p>


                  {/* Progress Indicators */}
                  <div className="flex gap-1 mt-3">
                    {features.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          index === activeFeature
                            ? `bg-gradient-to-r ${currentFeature.color} w-6`
                            : "bg-slate-300 w-1.5"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-white/40 rounded-full"></div>
      </div>
    </div>
  </div>

  {/* Active Feature Info */}
  <div className="text-center px-4">
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${currentFeature.color} text-white font-medium text-sm mb-4 shadow-lg`}
    >
      {currentFeature.icon}
      <span>
        Feature {activeFeature + 1} of {features.length}
      </span>
    </div>

    <h2 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">
      {currentFeature.title}
    </h2>

    <p className="text-base text-slate-600 leading-relaxed mb-6">
      {currentFeature.description}
    </p>

    {/* Navigation Arrows */}
    <div className="flex justify-center gap-4">
      <button
        onClick={prevFeature}
        className="group flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 active:scale-95"
        aria-label="Previous feature"
      >
        <ChevronLeft className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
      </button>
      <button
        onClick={nextFeature}
        className="group flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 active:scale-95"
        aria-label="Next feature"
      >
        <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
      </button>
    </div>
  </div>

{/* Clickable Feature Points - Mobile */}
<div className="px-2 mt-1">
  <h3 className="text-lg font-semibold text-slate-800 text-center mb-2 block">
    All Features
  </h3>
  <div className="max-h-[100px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-100">
    {features.map((feature, index) => (
      <button
        key={feature.id}
        onClick={() => handleFeatureClick(index)}
        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 active:scale-98 ${
          activeFeature === index
            ? "border-blue-500 bg-blue-50 shadow-lg"
            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}
          >
            <div className="scale-75">{feature.icon}</div>
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-bold text-sm mb-1 transition-colors truncate ${
                activeFeature === index
                  ? "text-blue-900"
                  : "text-slate-900"
              }`}
            >
              {feature.title}
            </h3>
            <p
              className={`text-xs transition-colors leading-relaxed line-clamp-2 ${
                activeFeature === index
                  ? "text-blue-700"
                  : "text-slate-600"
              }`}
            >
              {feature.description.substring(0, 80)}...
            </p>
          </div>

          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 flex-shrink-0 ${
              activeFeature === index
                ? "bg-blue-500 animate-pulse scale-100"
                : "bg-slate-300 scale-0"
            }`}
          ></div>
        </div>
      </button>
    ))}
  </div>
</div>

</div>

        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
