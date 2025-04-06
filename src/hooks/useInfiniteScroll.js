import { useRef, useCallback, useEffect } from 'react';

const useInfiniteScroll = (callback, isFetching) => {
  const observer = useRef();
  
  const lastElementRef = useCallback(node => {
    if (isFetching) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        callback();
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [callback, isFetching]);
  
  // Add cleanup using useEffect
  useEffect(() => {
    // Cleanup function to disconnect the observer when component unmounts
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);
  
  return lastElementRef;
};

export default useInfiniteScroll;