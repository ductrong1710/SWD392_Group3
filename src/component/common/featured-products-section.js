import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function FeaturedProductsSection({ setCurrentPage, setSelectedCategory, }) {
    const featuredImages = {
        "Summer Essentials": new URL("../../assets/img/Summer Essentials.jpg", import.meta.url).href,
        "Fall Collection": new URL("../../assets/img/Fall Collection.jpg", import.meta.url).href,
    };
    return (_jsxs("section", { className: "px-8 pb-16", children: [_jsx("h3", { className: "text-4xl font-serif font-semibold mb-8", children: "Featured Collections" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("button", { onClick: () => {
                            setSelectedCategory("Women");
                            setCurrentPage("products");
                        }, className: "relative rounded-lg p-8 h-48 flex flex-row items-center gap-6 hover:opacity-90 transition-opacity cursor-pointer group text-left overflow-hidden", style: {
                            backgroundImage: `url(${featuredImages["Summer Essentials"]})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" }), _jsxs("div", { className: "flex flex-col justify-center flex-1 relative z-10", children: [_jsx("p", { className: "text-sm font-serif text-white drop-shadow-lg", children: "Limited Collection" }), _jsx("h4", { className: "text-2xl font-serif font-semibold mt-2 text-white drop-shadow-lg group-hover:opacity-80 transition-opacity", children: "Summer Essentials" }), _jsx("span", { className: "text-sm font-serif font-medium text-white drop-shadow-lg mt-4", children: "Explore" })] })] }), _jsxs("button", { onClick: () => {
                            setSelectedCategory("Men");
                            setCurrentPage("products");
                        }, className: "relative rounded-lg p-8 h-48 flex flex-row items-center gap-6 hover:opacity-90 transition-opacity cursor-pointer group text-left overflow-hidden", style: {
                            backgroundImage: `url(${featuredImages["Fall Collection"]})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" }), _jsxs("div", { className: "flex flex-col justify-center flex-1 relative z-10", children: [_jsx("p", { className: "text-sm font-serif text-white drop-shadow-lg", children: "New Arrival" }), _jsx("h4", { className: "text-2xl font-serif font-semibold mt-2 text-white drop-shadow-lg group-hover:opacity-80 transition-opacity", children: "Fall Collection" }), _jsx("span", { className: "text-sm font-serif font-medium text-white drop-shadow-lg mt-4", children: "Shop Now" })] })] })] })] }));
}
