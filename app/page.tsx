export default function Home() {
  return (
    <>
      <div className="text-display-2 font-bold">디자인 시스템 REFIT</div>

      <button
        className={`
          m-4 px-4 py-2 rounded-md
          w-20 h-10
          bg-btn-primary-bg
          hover:bg-btn-primary-hover
          active:bg-btn-primary-pressed
          text-label font-semibold text-text-invert
          shadow-spread-medium
        `}
      >
        버튼
      </button>

      <div className="flex gap-2">
        <div className="w-10 h-10 bg-lime-500 rounded"></div>
        <div className="w-10 h-10 bg-primary-700 rounded"></div>
        <div className="w-10 h-10 bg-red-500 rounded"></div>
      </div>
    </>
  );
}
