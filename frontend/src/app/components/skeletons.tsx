export const AccountPageSkeleton = () => {
  return (
      <div
          className="flex flex-col items-center p-6 rounded-xl border-gray-300 shadow-xl animate-pulse">
        <div className="lg:w-[50%] sm:w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center md:justify-start">
              <div
                  className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] bg-gray-200 rounded-full"></div>
            </div>

            <div
                className="py-4 px-6 bg-gray-300 text-white rounded-xl flex justify-center md:justify-start">
              <div className="h-8 w-[120px] bg-gray-400 rounded"></div>
            </div>
          </div>

          <div className="w-full pt-20">
            <div className="mb-6 h-8 bg-gray-200 rounded"></div>

            <div className="pt-3 pb-6 space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="w-full p-4 h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>

            <div className="pt-3 pb-6 space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="w-full p-4 h-[200px] bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>

          <div className="cursor-pointer bg-gray-400 h-12 w-32 rounded-xl mt-4"></div>
        </div>
      </div>

  )
}