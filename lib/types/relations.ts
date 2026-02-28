import {WithIdDB} from "@/lib/types/common";
import {RecordId} from "surrealdb";

export interface RelationDB extends WithIdDB {
    in: RecordId;
    out: RecordId;
}