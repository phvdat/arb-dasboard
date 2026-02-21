import { ArbitrageResult } from "@/lib/store/type";

export interface StatusMode {
    status: "Running" | "Stopped";
}

export interface ArbitrageTable extends Omit<ArbitrageResult, 'history'> {
    inFixed?: boolean
}