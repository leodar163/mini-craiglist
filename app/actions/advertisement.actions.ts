"use server";

import {
    Advertisement, AdvertisementCategory,
    AdvertisementDB, AdvertisementPricing, AdvertisementStatus, AdvertisementType,
    convertAdvertisementDB,
    CreateAdvertisement,
    UpdateAdvertisement
} from "@/lib/types/advertisement";
import {ServerActionResponse} from "@/lib/types/actions";
import {DBTables, getDB} from "@/lib/db/surrealdb";
import {getSession} from "@/app/actions/auth.actions";
import {and, contains, containsAny, eq, gte, inside, lte, or, RecordId} from "surrealdb";

export async function createAdvertisement(create: CreateAdvertisement): ServerActionResponse<Advertisement> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }
    let db = await getDB();

    try {
        const [adResult] = await db
            .create(DBTables.advertisement)
            .content({
                ...create,
                author: new RecordId(DBTables.user, create.author.id),
            });

        await db.close();
        db = await getDB();

        const eagerAdResult = await db
            .select<AdvertisementDB>(adResult.id)
            .fetch("author");

        if (eagerAdResult == null) {
            return {
                success: false,
                error: new Error("unknown db error")
            }
        }

        return {
            success: true,
            value: convertAdvertisementDB(eagerAdResult)[0]
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error("unknown db error")
        }
    } finally {
        await db.close();
    }
}

export async function updateAdvertisement(id: string, update: UpdateAdvertisement): ServerActionResponse<Advertisement> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }
    let db = await getDB();

    try {
        const adResult = await db
            .update(new RecordId(DBTables.advertisement, id))
            .merge({...update});

        if (!adResult) {
            return {
                success: false,
                error: new Error(`Impossible to update advertisement "${id}"`)
            };
        }

        await db.close();
        db = await getDB();

        const eagerAdResult = await db
            .select<AdvertisementDB>(adResult.id)
            .fetch("author");

        if (eagerAdResult == null) {
            return {
                success: false,
                error: new Error("unknown db error")
            }
        }

        return {
            success: true,
            value: convertAdvertisementDB(eagerAdResult)[0]
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error("unknown db error")
        }
    } finally {
        await db.close();
    }


}


export async function deleteAdvertisement(id: string): ServerActionResponse<undefined> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();

    try {
        const adResult = await db.update<AdvertisementDB>(new RecordId(DBTables.advertisement, id)).content({
            status: AdvertisementStatus.ARCHIVED,
        });

        if (!adResult) {
            return {
                success: false,
                error: new Error(`Impossible to delete advertisement ${id}`)
            };
        }

        return {
            success: true,
            value: undefined
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error("unknown db error")
        };
    } finally {
        await db.close();
    }
}

export async function restoreAdvertisement(id: string): ServerActionResponse<undefined> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();

    try {
        const adResult = await db.update<AdvertisementDB>(new RecordId(DBTables.advertisement, id)).content({
            status: AdvertisementStatus.DRAFT,
        });

        if (!adResult) {
            return {
                success: false,
                error: new Error(`Impossible to restore advertisement ${id}`)
            };
        }

        return {
            success: true,
            value: undefined
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error("unknown db error")
        };
    } finally {
        await db.close();
    }
}

export async function publishAdvertisement(id: string): ServerActionResponse<undefined> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();

    try {
        const adResult = await db.update<AdvertisementDB>(new RecordId(DBTables.advertisement, id)).content({
            status: AdvertisementStatus.PUBLISHED,
        });

        if (!adResult) {
            return {
                success: false,
                error: new Error(`Impossible to publish advertisement ${id}`)
            };
        }

        return {
            success: true,
            value: undefined
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error("unknown db error")
        };
    } finally {
        await db.close();
    }
}

export async function getAdvertisementsByUser(userId: string): ServerActionResponse<Advertisement[]> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const allowedStatus = userId === session.value.user.id
        ? [AdvertisementStatus.PUBLISHED, AdvertisementStatus.DRAFT]
        : [AdvertisementStatus.PUBLISHED];

    const userRecordId = new RecordId(DBTables.user, userId);

    const db = await getDB();

    try {
        const adResults = await db
            .select<AdvertisementDB>(DBTables.advertisement)
            .where(and(eq("author", userRecordId), inside("status", allowedStatus)))
            .fetch("author");

        return {
            success: true,
            value: convertAdvertisementDB(...adResults)
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? new Error(error.message) : new Error("Unknown DB error")
        };
    } finally {
        await db.close()
    }

}

export async function getAdvertisement(adId: string): ServerActionResponse<Advertisement> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();

    try {
        const result = await db
            .select<AdvertisementDB>(new RecordId(DBTables.advertisement, adId))
            .fetch("author");

        if (result == null) {
            return {
                success: false,
                error: new Error(`Impossible to find advertisement with id "${adId}"`)
            };
        }

        return {
            success: true,
            value: convertAdvertisementDB(result)[0]
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? new Error(error.message) : new Error("Unknown DB error")
        };
    } finally {
        await db.close();
    }
}

export interface AdvertisementSearchFilters {
    text: string;
    town?: string;
    type?: AdvertisementType;
    categories?: AdvertisementCategory[];
    minPrice?: number;
    maxPrice?: number;
    pricing?: AdvertisementPricing;
}

export async function searchForAdvertisement(filters: AdvertisementSearchFilters): ServerActionResponse<Advertisement[]> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();

    const conditions = [
        or(
            contains("string::lowercase(title)", filters.text.toLowerCase()),
            contains("string::lowercase(description)", filters.text.toLowerCase()),
        )
    ];

    if (filters.town != null) conditions.push(contains("string::lowercase(town)", filters.town.toLowerCase()));
    if (filters.type != null) conditions.push(eq("type", filters.type));
    if (filters.categories != null) conditions.push(containsAny("categories", filters.categories));
    if (filters.minPrice != null) conditions.push(gte("price", filters.minPrice));
    if (filters.maxPrice != null) conditions.push(lte("price", filters.maxPrice));
    if (filters.pricing != null) conditions.push(eq("pricing", filters.pricing));


    try {
        const results = await db
            .select<AdvertisementDB>(DBTables.advertisement)
            .where(and(...conditions))
            .fetch("author");

        return {
            success: true,
            value: convertAdvertisementDB(...results),
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? new Error(error.message) : new Error("Unknown DB error")
        };
    } finally {
        db.close();
    }
}