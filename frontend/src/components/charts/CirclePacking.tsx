import { QueryResults } from "../../types";
import TreeMap from "./TreeMap";

type CirclePackingProps = {
    results: QueryResults;
    width: number;
    height: number;
};

export const CirclePacking = (props: CirclePackingProps) => {
return <TreeMap {...props} mode="circlePack"/>
}