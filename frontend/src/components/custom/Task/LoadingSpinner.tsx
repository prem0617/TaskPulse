const LoadingSpinner = () => {
  return (
    <div className="p-8 bg-[#f7f7f7] min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <div className=" py-12">
          <div className="w-8 h-8 border-4 border-[#93deff] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
