import { useRef, useCallback, useEffect } from 'react';

const useInfiniteScroll = (loadMore, isLoading) => {
  const observer = useRef();
  
  const lastElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && entries[0].isIntersecting) {
        loadMore();
      }
    }, {
      rootMargin: '0px 0px 500px 0px', // Load more when within 500px of the bottom
      threshold: 0.1 // Trigger when 10% of the element is visible
    });
    
    if (node) observer.current.observe(node);
  }, [loadMore, isLoading]);
  
  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);
  
  return lastElementRef;
};

export default useInfiniteScroll;