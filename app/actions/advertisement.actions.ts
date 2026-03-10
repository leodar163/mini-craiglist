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
import {and, contains, containsAny, eq, expr, gte, inside, lte, matches, or, RecordId, surql} from "surrealdb";
import {RelationDB} from "@/lib/types/relations";
import {convertUserDB, User, UserDB} from "@/lib/types/user";
import {filter} from "eslint-config-next";

export async function createAdvertisement(create: CreateAdvertisement): ServerActionResponse<Advertisement> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }
    let db = await getDB();

    const adResults = await db.create<AdvertisementDB>(DBTables.advertisement).content({
        ...create
    });

    await db.close();

    const ad = adResults[0];

    if (!ad) {
        return {
            success: false,
            error: new Error(`Impossible to create advertisement "${create.title}"`)
        }
    }

    db = await getDB();
    const relationResult = await db.relate<RelationDB>(new RecordId(DBTables.user, session.value.user.id), DBTables.wroteAd, ad.id).unique();
    await db.close();

    db = await getDB();
    if (!relationResult) {
        db.delete(ad.id);
        return {
            success: false,
            error: new Error(`Impossible to create advertisement "${create.title}" because of authorship with user "${session.value.user.pseudo}"`)
        }
    }
    await db.close();

    return {
        success: true,
        value: convertAdvertisementDB(ad)[0]
    };
}

export async function updateAdvertisement(id: string, update: UpdateAdvertisement): ServerActionResponse<Advertisement> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }
    const db = await getDB();

    const adResult = await db.update<AdvertisementDB>(new RecordId(DBTables.advertisement, id)).merge({...update});

    if (!adResult) {
        return {
            success: false,
            error: new Error(`Impossible to update advertisement "${id}"`)
        };
    }

    db.close();

    return {
        success: true,
        value: convertAdvertisementDB(adResult)[0]
    };
}


export async function deleteAdvertisement(id: string): ServerActionResponse<undefined> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();

    const adResult = await db.update<AdvertisementDB>(new RecordId(DBTables.advertisement, id)).content({
        status: AdvertisementStatus.ARCHIVED,
    });

    if (!adResult) {
        return {
            success: false,
            error: new Error(`Impossible to delete advertisement ${id}`)
        };
    }

    db.close();

    return {
        success: true,
        value: undefined
    }
}

export async function restoreAdvertisement(id: string): ServerActionResponse<undefined> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();

    const adResult = await db.update<AdvertisementDB>(new RecordId(DBTables.advertisement, id)).content({
        status: AdvertisementStatus.DRAFT,
    });

    if (!adResult) {
        return {
            success: false,
            error: new Error(`Impossible to delete advertisement ${id}`)
        };
    }

    db.close();

    return {
        success: true,
        value: undefined
    }
}

export async function publishAdvertisement(id: string): ServerActionResponse<undefined> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();

    const adResult = await db.update<AdvertisementDB>(new RecordId(DBTables.advertisement, id)).content({
        status: AdvertisementStatus.PUBLISHED,
    });

    if (!adResult) {
        return {
            success: false,
            error: new Error(`Impossible to delete advertisement ${id}`)
        };
    }

    db.close();

    return {
        success: true,
        value: undefined
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

    const query = surql`
        SELECT array::flatten(->wrote_ad->advertisement[
        WHERE status INSIDE ${allowedStatus}
        ].*) AS ads
        FROM ${userRecordId};
    `;


    try {
        //Le type de retour de la query est PARTICULIEREMENT difficile à cerner...
        const [[adResults]] = await db.query<[{ ads: AdvertisementDB[] }[]]>(
            query
        ).collect();
        await db.close();

        return {
            success: true,
            value: convertAdvertisementDB(...adResults
                .ads.sort((a, b) => a.createdAt.compare(b.createdAt))
            )
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? new Error(error.message) : new Error("Unknown DB error")
        };
    } finally {
        db.close()
    }

}

export async function getAdvertisement(adId: string): ServerActionResponse<Advertisement> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();
    const result = await db.select<AdvertisementDB>(new RecordId(DBTables.advertisement, adId));
    db.close();

    if (!result) {
        return {
            success: false,
            error: new Error(`Impossible to find advertisement with id "${adId}"`)
        };
    }

    return {
        success: true,
        value: convertAdvertisementDB(result)[0]
    };
}

export async function getAdvertisementsAuthor(adId: string): ServerActionResponse<User> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    let db = await getDB();
    const [result] = await db.select<RelationDB>(
        DBTables.wroteAd).where(eq("out", new RecordId(DBTables.advertisement, adId))
    );
    db.close();

    if (!result) {
        return {
            success: false,
            error: new Error(`Impossible to get author of advertisement with id "${adId}"`)
        };
    }


    db = await getDB();
    const userResult = await db.select<UserDB>(new RecordId(DBTables.user, result.in.id));
    db.close();

    if (!userResult) {
        return {
            success: false,
            error: new Error(`Impossible to get author of advertisement with id "${adId}"`)
        };
    }

    return {
        success: true,
        value: convertUserDB(userResult)[0]
    };
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
        const results = await db.select<AdvertisementDB>(DBTables.advertisement).where(and(...conditions));

        return {
            success: true,
            value: convertAdvertisementDB(...results),
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? new Error(error.message) : new Error("Unknown DB error")
        };
    }
    finally {
        db.close();
    }
}