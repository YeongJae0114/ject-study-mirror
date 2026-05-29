export default function Home() {
  return (
    <>
      <div className="text-display-2 font-bold">디자인 시스템 REFIT</div>

      <button
        className={`bg-btn-primary-bg hover:bg-btn-primary-hover active:bg-btn-primary-pressed text-label text-text-invert shadow-spread-medium m-4 h-10 w-20 rounded-md px-4 py-2 font-semibold`}
      >
        버튼
      </button>

      <div className="flex gap-2">
        <div className="h-10 w-10 rounded bg-lime-500"></div>
        <div className="bg-primary-700 h-10 w-10 rounded"></div>
        <div className="h-10 w-10 rounded bg-red-500"></div>
      </div>
    </>
  );
}
