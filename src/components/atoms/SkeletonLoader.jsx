const SkeletonLoader = ({ count = 1, className = '', type = 'property' }) => {
  const skeletons = Array.from({ length: count }, (_, index) => index);

  const PropertySkeleton = () => (
    <div className="bg-white rounded-12 shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
      <div className="flex space-x-4">
        <div className="w-20 h-16 bg-gray-200 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );

  const DetailSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="h-64 md:h-96 bg-gray-200 rounded-12"></div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );

  const getSkeletonComponent = () => {
    switch (type) {
      case 'list':
        return ListSkeleton;
      case 'detail':
        return DetailSkeleton;
      default:
        return PropertySkeleton;
    }
  };

  const SkeletonComponent = getSkeletonComponent();

  return (
    <div className={className}>
      {skeletons.map((index) => (
        <SkeletonComponent key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader;