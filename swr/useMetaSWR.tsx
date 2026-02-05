import { endpoint } from "@/config/endpoint";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const useMetaSWR = () => {
    return useSWR(endpoint.meta, fetcher);
}