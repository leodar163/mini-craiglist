'use server';

import {ServerActionResponse} from "@/lib/types/actions";
import {
    convertDiscussionDB,
    convertMessageDB,
    Discussion,
    DiscussionDB,
    Message,
    MessageDB
} from "@/lib/types/discussion";
import {getSession} from "@/app/actions/auth.actions";
import {DBTables, getDB} from "@/lib/db/surrealdb";
import {eq, inside, or, RecordId} from "surrealdb";
import {getAdvertisementsByUser} from "@/app/actions/advertisement.actions";

export async function getDiscussion(id: string): ServerActionResponse<Discussion> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();

    try {
        const discussionResult = await db.select<DiscussionDB>(new RecordId(DBTables.discussion, id))
            .fetch("sender", "advertisement");
        await db.close();
        if (discussionResult == null) return {
            success: false,
            error: new Error(`No discussion with id "${id}"`)
        }

        return {
            success: true,
            value: (await convertDiscussionDB(discussionResult))[0]
        }

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error("unknown db error")
        }
    } finally {
        db.close();
    }
}

export async function getMessagesOfDiscussion(id: string): ServerActionResponse<Message[]> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();

    try {
        const messageResult = await db.select<MessageDB>(DBTables.message)
            .where(eq("discussion", new RecordId(DBTables.discussion, id)))

        return {
            success: true,
            value: convertMessageDB(...messageResult)
                .sort((a,b)=> a.createdAt.getTime() - b.createdAt.getTime())
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error("unknown db error")
        }
    }
    finally {
        db.close();
    }
}

export async function getDiscussionsOfUser(userId: string): ServerActionResponse<Discussion[]> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();

    try {
        const advertisements = await getAdvertisementsByUser(userId);
        if (!advertisements.success) {
            return advertisements;
        }

        const adIds = advertisements.value
            .map(ad => new RecordId(DBTables.advertisement, ad.id));

        const discussionResults = await db.select<DiscussionDB>(DBTables.discussion)
            .where(or(
                inside("advertisement", adIds),
                eq("sender", new RecordId(DBTables.user, userId))
            )).fetch("advertisement", "sender");

        console.log(discussionResults);

        return {
            success: true,
            value: (await convertDiscussionDB(...discussionResults))
                .sort((a,b) =>
                    b.messages[b.messages.length - 1].createdAt.getTime() -
                    a.messages[a.messages.length - 1].createdAt.getTime()
                )
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error("unknown db error")
        }
    }
    finally {
        db.close();
    }
}