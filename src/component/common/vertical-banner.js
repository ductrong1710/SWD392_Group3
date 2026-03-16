import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
export default function VerticalBanner() {
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
        @keyframes scrollVertical {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        .vertical-banner-scroll {
          animation: scrollVertical 30s linear infinite;
        }
      ` }), _jsx("div", { className: "absolute left-0 top-0 h-full w-10 bg-black z-40 overflow-hidden flex items-start justify-center", children: _jsx("div", { className: "vertical-banner-scroll flex flex-col", children: [...Array(50)].map((_, i) => (_jsx("div", { className: "text-white font-serif font-bold text-xl tracking-wide py-8 whitespace-nowrap", style: {
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)"
                        }, children: "SALE BLACK FRIDAY" }, i))) }) })] }));
}
