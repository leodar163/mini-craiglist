import {RecordId} from "surrealdb";

export enum AdvertisementType {
    OFFER = "offer",
    REQUEST = "request",
}

export function translateAdvertisementType(value: AdvertisementType) {
    switch(value) {
        case AdvertisementType.OFFER:
            return "Offre"
        case AdvertisementType.REQUEST:
            return "Demande"
    }
}

export enum AdvertisementPricing {
    FREE = "free",
    HOURLY = "hourly",
    FIXED = "fixed",
}

export function translateAdvertisementPricing(value: AdvertisementPricing) {
    switch(value) {
        case AdvertisementPricing.FREE:
            return "Gratuit";
        case AdvertisementPricing.HOURLY:
            return "A l'heure";
        case AdvertisementPricing.FIXED:
            return "Fixe";
    }
}

export enum AdvertisementModality {
    REMOTE = "remote",
    AT_PROVIDER = "at provider",
    AT_CUSTOMER = "at customer",
}

export function translateAdvertisementModality(value: AdvertisementModality) {
    switch(value) {
        case AdvertisementModality.REMOTE:
            return "A distance";
        case AdvertisementModality.AT_PROVIDER:
            return "Ne se déplace pas";
        case AdvertisementModality.AT_CUSTOMER:
            return "Se déplace";
    }
}

export enum AdvertisementStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived",
}

export function translateAdvertisementStatus(value: AdvertisementStatus) {
    switch(value) {
        case AdvertisementStatus.DRAFT:
            return "Brouillon";
        case AdvertisementStatus.PUBLISHED:
            return "Publié";
        case AdvertisementStatus.ARCHIVED:
            return "Archivé";
    }
}

export enum AdvertisementCategory {
    CRAFT = "craft",
    CARE = "care",
    STUDIES = "studies",
    ENVIRONMENT = "environment",
    CLEANING = "cleaning",
    POLITICS = "politics",
    GIVEAWAY = "give away",
    SOCIABILITY = "sociability",
    LANGUAGE = "language",
}

export function translateAdvertisementCategory(value: AdvertisementCategory) {
    switch(value) {
        case AdvertisementCategory.CRAFT:
            return "Bricolage";
        case AdvertisementCategory.CARE:
            return "Prendre-soin";
        case AdvertisementCategory.STUDIES:
            return "Etudes";
        case AdvertisementCategory.ENVIRONMENT:
            return "Environnement";
        case AdvertisementCategory.CLEANING:
            return "Nettoyage";
        case AdvertisementCategory.POLITICS:
            return "Politique";
        case AdvertisementCategory.GIVEAWAY:
            return "Don";
        case AdvertisementCategory.SOCIABILITY:
            return "Sociabilité";
        case AdvertisementCategory.LANGUAGE:
            return "Langues";
    }
}

export interface Advertisement {
    id: string;
    title: string;
    description: string;
    type: AdvertisementType;
    categories: AdvertisementCategory[];
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
    categories: AdvertisementCategory[];
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
    categories?: AdvertisementCategory[];
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
    categories: AdvertisementCategory[];
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