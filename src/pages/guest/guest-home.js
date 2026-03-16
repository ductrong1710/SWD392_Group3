"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import HeroSection from "../../component/common/hero-section";
import CategoriesSection from "../../component/common/categories-section";
import FeaturedProductsSection from "../../component/common/featured-products-section";
import VerticalBanner from "../../component/common/vertical-banner";
export default function GuestHome({ setCurrentPage, setSelectedCategory, }) {
    useEffect(() => {
        // Immediate scroll to top
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        // Multiple attempts to ensure scroll happens
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
    return (_jsxs("div", { className: "relative", children: [_jsx(VerticalBanner, {}), _jsxs("div", { className: "space-y-16", children: [_jsx(HeroSection, { setCurrentPage: setCurrentPage, setSelectedCategory: setSelectedCategory }), _jsx("div", { className: "pl-12", children: _jsx(CategoriesSection, { setCurrentPage: setCurrentPage, setSelectedCategory: setSelectedCategory }) }), _jsx("div", { className: "pl-12 mb-16", children: _jsx(FeaturedProductsSection, { setCurrentPage: setCurrentPage, setSelectedCategory: setSelectedCategory }) })] })] }));
}
