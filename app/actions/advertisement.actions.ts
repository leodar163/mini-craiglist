"use server";

import {
    Advertisement,
    AdvertisementDB, AdvertisementStatus,
    convertAdvertisementDB,
    CreateAdvertisement,
    UpdateAdvertisement
} from "@/lib/types/advertisement";
import {ServerActionResponse} from "@/lib/types/actions";
import {DBTables, getDB} from "@/lib/db/surrealdb";
import {getSession} from "@/app/actions/auth.actions";
import {RecordId, surql} from "surrealdb";
import {RelationDB} from "@/lib/types/relations";

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

    const adResult = await db.update<AdvertisementDB>(new RecordId(DBTables.advertisement, id)).content({...update});

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

export async function getAdvertisementsByUser(userId: string): ServerActionResponse<Advertisement[]> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();

    const allowedStatus = userId === session.value.user.id
        ? [AdvertisementStatus.PUBLISHED, AdvertisementStatus.DRAFT]
        : [AdvertisementStatus.PUBLISHED];

    const userRecordId = new RecordId(DBTables.user, userId);

    try {
        const [adResults] = await db.query<[AdvertisementDB[]]>(
            surql`SELECT VALUE ->wrote_ad->advertisement.*
                  FROM ${userRecordId}
                  WHERE ->wrote_ad->advertisement.status INSIDE [${allowedStatus}];`
        ).collect();

        return {
            success: true,
            value: convertAdvertisementDB(...adResults)
        };
    }
    catch (error) {
        console.log(error);
        return {
            success: false,
            error: error instanceof Error ? new Error(error.message) : new Error("Unknown DB error")
        };
    }
    finally {
        db.close()
    }

}