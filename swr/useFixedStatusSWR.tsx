import { endpoint } from "@/config/endpoint";
import { StatusMode } from "@/types/common";
import useSWR from "swr";

const fetcher = (url: string): Promise<StatusMode> => fetch(url).then((r) => r.json());

export const useFixedStatusSWR = () => {
    return useSWR(endpoint.fixed.status, fetcher);
}