import { useEffect, useState } from 'preact/hooks'

/*
 * https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 * */

const useIntersectObserver = ({
  ref,
  rootMargin = '0px',
  threshold = 0,
  continueObserving = false,
  root = null,
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  useEffect(() => {
    let observer
    let observerRefValue = null

    if ((!isIntersecting || continueObserving) && ref.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting)
        },
        { rootMargin, threshold, root },
      )

      observer.observe(ref.current)
      observerRefValue = ref.current
    }

    return () => {
      if (observerRefValue && observer) {
        observer.unobserve(observerRefValue)
      }
    }
  }, [isIntersecting, ref, rootMargin, threshold, continueObserving, root])
  return isIntersecting
}

export default useIntersectObserver
