import { useEffect, useState } from "react";

export default function useFetch(requests: FetchOptions | FetchOptions[]) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const requestList = Array.isArray(requests) ? requests : [requests];

      try {
        const responses = await Promise.all(
          requestList.map(async ({ url, options }) => {
            const response = await fetch(url, options);

            if (!response.ok) {
              return null;
            }

            return await response.json();
          })
        );
        setData(responses);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [requests]);

  return { data };
}
