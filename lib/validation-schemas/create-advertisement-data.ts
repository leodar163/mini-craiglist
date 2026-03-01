import * as v from "valibot";
import {
    AdvertisementCategory,
    AdvertisementModality,
    AdvertisementPricing,
    AdvertisementType
} from "@/lib/types/advertisement";


export const createAdvertisementSchema = v.object({
    title: v.pipe(
        v.string(),
        v.minLength(3, "doit faire au moins 3 caractères")
    ),
    description: v.pipe(
        v.string(),
        v.minLength(10, `doit fait au moins 10 caractères`)
    ),
    type: v.pipe(
        v.string(),
        v.enum(AdvertisementType, "doit être un type d'annonce valide")
    ),
    town: v.string(),
    availability: v.string(),
    pricing: v.enum(AdvertisementPricing, "doit être un type de tarif valide"),
    price: v.pipe(
        v.number(),
        v.minValue(0, "doit être égal ou supérieur à 0")
    ),
    modality: v.enum(AdvertisementModality, "doit être un type de modalité valide"),
    categories: v.array(v.enum(AdvertisementCategory, "doit être une catégorie valide")),

})

export type CreateAdvertisementData = v.InferOutput<typeof createAdvertisementSchema>;