import { useState, useEffect } from "react";

export default function useFetch(fetchFunction, dependencies = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // avoid memory leaks
    setLoading(true);
    setError(null);

    fetchFunction()
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => (isMounted = false);
  }, dependencies);

  return { data, loading, error };
}
