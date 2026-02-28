import {RecordId} from "surrealdb";
import {WithIdDB} from "@/lib/types/common";

export enum AdvertisementType {
    OFFER = "offer",
    REQUEST = "request",
}

export enum AdvertisementPricing {
    FREE = "free",
    HOURLY = "hourly",
    FIXED = "fixed",
}

export enum AdvertisementModality {
    REMOTE = "remote",
    AT_PROVIDER = "at provider",
    AT_CUSTOMER = "at customer",
}

export enum AdvertisementStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived",
}

export interface Advertisement {
    id: string;
    title: string;
    description: string;
    type: AdvertisementType;
    categories: string[];
    town: string;
    availability: string;
    pricing: AdvertisementPricing,
    price?: number;
    modality: AdvertisementModality;
    status: AdvertisementStatus;
}

export interface CreateAdvertisement {
    type: AdvertisementType;
    title: string;
    description: string;
    categories: string[];
    town: string;
    availability: string;
    pricing: AdvertisementPricing,
    price?: number;
    modality: AdvertisementModality;
}

export interface UpdateAdvertisement {
    type?: AdvertisementType;
    title?: string;
    description: string;
    categories?: string[];
    town?: string;
    availability?: string;
    pricing?: AdvertisementPricing,
    price?: number;
    modality?: AdvertisementModality;
}

export interface AdvertisementDB {
    id: RecordId,
    type: AdvertisementType;
    description: string;
    title: string;
    categories: string[];
    town: string;
    availability: string;
    pricing: AdvertisementPricing,
    price?: number;
    modality: AdvertisementModality;
    status: AdvertisementStatus;
}


export function convertAdvertisementDB(...advertisements: AdvertisementDB[]): Advertisement[] {
    return advertisements.map((advertisement: AdvertisementDB) => {
        return {...advertisement, id: advertisement.id.id.toString()};
    })
}