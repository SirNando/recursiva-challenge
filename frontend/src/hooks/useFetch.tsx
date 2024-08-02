import { useEffect, useState } from "react";

export default function useFetch(requestURL: string, options?: RequestInit) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(requestURL, options);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [requestURL]);

  return { data };
}
