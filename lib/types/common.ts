import {DateTime, RecordId} from "surrealdb";

export interface WithID {
    id: string;
}

export interface Common extends WithID {
    createdAt: Date,
    updatedAt: Date,
}

export interface WithIdDB {
    id: RecordId;
}
export interface CommonDB extends WithIdDB {
    createdAt: DateTime,
    updatedAt: DateTime,
}