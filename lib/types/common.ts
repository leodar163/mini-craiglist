import {DateTime, RecordId} from "surrealdb";

export interface WithID {
    id: string;
}

export interface Common extends WithID {
    createdAT: Date,
    updatedAT: Date,
}

export interface WithIdDB {
    id: RecordId;
}
export interface CommonDB extends WithIdDB {
    createAt: DateTime,
    updateAT: DateTime,
}