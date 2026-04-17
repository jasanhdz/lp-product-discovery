import { useEffect, useRef, useState } from 'react'

interface UseObserverRecoveryProps {
  isFetching: boolean
  isError: boolean
  hasNext: boolean
  refetchAction: () => void
  onIntersect: () => void
}

export function useObserverRecovery({
  isFetching,
  isError,
  hasNext,
  refetchAction,
  onIntersect
}: UseObserverRecoveryProps) {
  const observerTarget = useRef<HTMLDivElement | null>(null)
  const [cooldown, setCooldown] = useState<number>(0)
  const isFetchingRef = useRef<boolean>(isFetching)
  const isErrorRef = useRef<boolean>(isError || cooldown > 0)
  const hasNextRef = useRef<boolean>(hasNext)

  useEffect(() => {
    isFetchingRef.current = isFetching
    isErrorRef.current = isError || cooldown > 0
    hasNextRef.current = hasNext
  }, [isFetching, isError, cooldown, hasNext])
  useEffect(() => {
    if (isError && !isFetching && cooldown === 0) {
      setCooldown(5)
    }
  }, [isError, isFetching, cooldown])

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (cooldown === 0 && isError && !isFetching && refetchAction) {
      refetchAction()
    }
  }, [cooldown, isError, isFetching, refetchAction])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && !isFetchingRef.current && hasNextRef.current && !isErrorRef.current) {
          onIntersect()
        }
      },
      { rootMargin: '400px' }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) observer.observe(currentTarget)

    return () => observer.disconnect()
  }, [onIntersect])

  return { observerTarget, cooldown }
}
