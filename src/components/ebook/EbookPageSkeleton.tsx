const EbookPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-center mb-16">
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="h-6 w-24 bg-slate-200 rounded-full mb-4"></div>
              <div className="h-12 bg-slate-200 rounded mb-4"></div>
              <div className="h-4 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-6"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <div className="h-5 w-20 bg-slate-200 rounded"></div>
                </div>
                <div className="h-5 w-32 bg-slate-200 rounded"></div>
              </div>

              <div className="h-12 w-40 bg-slate-200 rounded-lg"></div>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-blue-200 rounded-2xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-blue-100 rounded-2xl transform -rotate-3"></div>
              <div className="relative rounded-2xl shadow-2xl w-full h-80 bg-slate-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EbookPageSkeleton;