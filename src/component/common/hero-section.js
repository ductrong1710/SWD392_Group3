import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function HeroSection({ setCurrentPage, setSelectedCategory, }) {
    return (_jsxs("section", { className: "relative bg-gradient-to-br from-secondary to-secondary/50 py-16 md:py-24 overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0 w-full h-full overflow-hidden", children: [_jsx("iframe", { className: "absolute top-1/2 left-1/2 w-[300%] h-[300%] pointer-events-none", style: {
                            transform: 'translate(-50%, -50%)',
                            minWidth: '100vw',
                            minHeight: '100vh',
                        }, src: "https://www.youtube.com/embed/HriD0WOQL8I?autoplay=1&mute=1&loop=1&playlist=HriD0WOQL8I&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playsinline=1", title: "Background video", allow: "autoplay; encrypted-media" }), _jsx("div", { className: "absolute inset-0 bg-black/40" })] }), _jsxs("div", { className: "px-8 pl-20 relative z-10", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-4xl md:text-6xl font-serif font-bold mb-6 text-white drop-shadow-lg", children: "Discover Timeless Fashion" }), _jsx("p", { className: "text-lg font-serif text-white mb-8 drop-shadow-md", children: "Explore our curated collection of premium fashion pieces for every occasion. Login to start shopping today." })] }), _jsxs("div", { className: "flex gap-4 flex-wrap mt-12 md:mt-16", children: [_jsx("button", { onClick: () => setCurrentPage("login"), className: "px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-serif font-medium shadow-lg", children: "Sign Up to Shop" }), _jsx("button", { onClick: () => {
                                    setSelectedCategory(null);
                                    setCurrentPage("products");
                                }, className: "px-6 py-3 bg-transparent text-white rounded-lg hover:border-2 hover:border-white transition-colors font-serif font-medium", children: "Browse as Guest" })] })] })] }));
}
