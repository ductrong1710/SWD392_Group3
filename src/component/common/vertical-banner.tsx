export default function VerticalBanner() {
  return (
    <>
      <style>{`
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
      `}</style>
      <div className="absolute left-0 top-0 h-full w-10 bg-black z-40 overflow-hidden flex items-start justify-center">
        <div className="vertical-banner-scroll flex flex-col">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="text-white font-serif font-bold text-xl tracking-wide py-8 whitespace-nowrap"
              style={{ 
                writingMode: "vertical-rl",
                transform: "rotate(180deg)"
              }}
            >
                   SALE BLACK FRIDAY   
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
