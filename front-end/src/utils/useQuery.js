/**
 * useQuery is a custom hook that makes use of the useLocation and the URL class to parse the query parameters.
 *
 * @example
 *
 *     const query = useQuery();
 *     const date = query.get("date")
 */

import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default useQuery;


/*
More info on this (ZW):

https://v5.reactrouter.com/web/example/query-parameters

*/