import { useEffect, useState } from "react";

export default function useFetch(requests: FetchOptions | FetchOptions[]) {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchCount, setRefetchCount] = useState(0);

  function refetch() {
    setRefetchCount((prevCount) => prevCount + 1);
    setError(null);
  }

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const requestList = Array.isArray(requests) ? requests : [requests];

      try {
        const responses = await Promise.all(
          requestList.map(async ({ url, options }) => {
            const response = await fetch(url, options);

            if (!response.ok) {
              throw new Error(response.statusText);
            } else {
              return await response.json();
            }
          })
        );
        setData(responses);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          setError(error.message);
        } else {
          console.error("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [requests, refetchCount]);

  return { data, error, isLoading, refetch };
}
