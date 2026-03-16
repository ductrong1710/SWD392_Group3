"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import CategoriesSection from "../../component/common/categories-section";
import FeaturedProductsSection from "../../component/common/featured-products-section";
import VerticalBanner from "../../component/common/vertical-banner";
export default function UserHome({ setCurrentPage, setSelectedCategory, }) {
    // Scroll to top like guest-home
    useEffect(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        const scrollToTop = () => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };
        const timeout1 = requestAnimationFrame(scrollToTop);
        const timeout2 = setTimeout(scrollToTop, 10);
        const timeout3 = setTimeout(scrollToTop, 50);
        const timeout4 = setTimeout(scrollToTop, 100);
        const timeout5 = setTimeout(scrollToTop, 200);
        return () => {
            cancelAnimationFrame(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
            clearTimeout(timeout4);
            clearTimeout(timeout5);
        };
    }, []);
    return (_jsxs("div", { className: "relative", children: [_jsx(VerticalBanner, {}), _jsxs("div", { className: "space-y-16", children: [_jsxs("section", { className: "relative bg-gradient-to-br from-secondary to-secondary/50 py-16 md:py-24 overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0 w-full h-full overflow-hidden", children: [_jsx("iframe", { className: "absolute top-1/2 left-1/2 w-[300%] h-[300%] pointer-events-none", style: {
                                            transform: "translate(-50%, -50%)",
                                            minWidth: "100vw",
                                            minHeight: "100vh",
                                        }, src: "https://www.youtube.com/embed/HriD0WOQL8I?autoplay=1&mute=1&loop=1&playlist=HriD0WOQL8I&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playsinline=1", title: "Background video", allow: "autoplay; encrypted-media" }), _jsx("div", { className: "absolute inset-0 bg-black/40" })] }), _jsxs("div", { className: "px-8 pl-20 relative z-10", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-accent font-semibold mb-4 drop-shadow-md", children: "PERSONALIZED FOR YOU" }), _jsx("h2", { className: "text-4xl md:text-6xl font-serif font-bold mb-6 text-white drop-shadow-lg", children: "Welcome Back, John" }), _jsx("p", { className: "text-lg font-serif text-white mb-8 drop-shadow-md", children: "Continue shopping your favorite collections with personalized recommendations." })] }), _jsxs("div", { className: "flex gap-4 flex-wrap mt-12 md:mt-16", children: [_jsx("button", { onClick: () => setCurrentPage("products"), className: "px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-serif font-medium shadow-lg", children: "Explore New Arrivals" }), _jsx("button", { onClick: () => setCurrentPage("orders"), className: "px-6 py-3 bg-transparent text-white rounded-lg hover:border-2 hover:border-white transition-colors font-serif font-medium", children: "View My Orders" })] })] })] }), _jsx("div", { className: "pl-12", children: _jsx(CategoriesSection, { setCurrentPage: setCurrentPage, setSelectedCategory: setSelectedCategory }) }), _jsx("div", { className: "pl-12", children: _jsx(FeaturedProductsSection, { setCurrentPage: setCurrentPage, setSelectedCategory: setSelectedCategory }) }), _jsxs("section", { className: "max-w-7xl mx-auto px-4 pb-12", children: [_jsx("h3", { className: "text-2xl font-serif font-semibold mb-8", children: "Recommended For You" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: _jsxs("button", { onClick: () => setCurrentPage("products"), className: "bg-secondary rounded-lg p-8 h-48 flex flex-col justify-between hover:bg-secondary/80 transition-colors cursor-pointer text-left", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Based on your style" }), _jsx("h4", { className: "text-2xl font-semibold mt-2", children: "Similar to Your Favorites" })] }), _jsxs("div", { className: "flex items-center gap-2 text-primary", children: [_jsx("span", { className: "text-sm font-medium", children: "Discover" }), _jsx(ArrowRight, { className: "w-4 h-4" })] })] }) })] })] })] }));
}
