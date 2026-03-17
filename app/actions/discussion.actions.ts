'use server';

import {ServerActionResponse} from "@/lib/types/actions";
import {
    convertDiscussionDB,
    convertMessageDB, CreateDiscussion, CreateDiscussionDB,
    Discussion,
    DiscussionDB,
    Message,
    MessageDB
} from "@/lib/types/discussion";
import {getSession} from "@/app/actions/auth.actions";
import {DBTables, getDB} from "@/lib/db/surrealdb";
import {and, eq, or, RecordId} from "surrealdb";

const eagerFields = ["advertisement", "advertisement.author", "sender"];

export async function createDiscussion(create: CreateDiscussion): ServerActionResponse<{id: string}> {
    const session = getSession();
    if (!session) {
        return session;
    }

    const db = await getDB();

    try {
        const createResult= await db
            .create<CreateDiscussionDB>(DBTables.discussion)
            .content({
                sender: new RecordId(DBTables.user, create.sender.id),
                advertisement: new RecordId(DBTables.advertisement, create.advertisement.id)
            });

       return {
           success: true,
           value: {id: createResult[0].id.id.toString()}
       }
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error("unknown db error")
        };
    }
    finally {
        await db.close();
    }
}

export async function getDiscussion(id: string): ServerActionResponse<Discussion> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();

    try {
        const discussionResult = await db
            .select<DiscussionDB>(new RecordId(DBTables.discussion, id))
            .fetch(...eagerFields);

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
        await db.close();
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
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
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

export async function getDiscussionsOfUser(userId: string): ServerActionResponse<Discussion[]> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();

    const userRecordID = new RecordId(DBTables.user, userId);

    try {
        const discussionResults = await db.select<DiscussionDB>(DBTables.discussion)
            .where(or(
                eq("advertisement.author", userRecordID),
                eq("sender", userRecordID)
            )).fetch(...eagerFields);

        return {
            success: true,
            value: (await convertDiscussionDB(...discussionResults))
                .sort((a, b) =>
                    (b.messages[b.messages.length - 1]?.createdAt.getTime() ?? 0) -
                    (a.messages[a.messages.length - 1]?.createdAt.getTime() ?? 0)
                )
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error("unknown db error")
        }
    } finally {
        db.close();
    }
}

export async function sendMessage(discussionId: string, message: string): ServerActionResponse<Message> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    if (message == "") return {
        success: false,
        error: new Error("Cannot send an empty message")
    };

    const db = await getDB();

    try {
        const [messageResult] = await db.create<MessageDB>(DBTables.message).content({
            discussion: new RecordId(DBTables.discussion, discussionId),
            text: message,
            sender: new RecordId(DBTables.user, session.value.user.id),
        });

        if (messageResult == null) return {
            success: false,
            error: new Error("unknown db error")
        };

        return {
            success: true,
            value: convertMessageDB(messageResult)[0]
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error("unknown db error")
        };
    } finally {
        await db.close();
    }
}

export async function getDiscussionOfAdvertisement(adId: string): ServerActionResponse<Discussion[]> {
    const session = await getSession();
    if (!session.success) {
        return session;
    }

    const db = await getDB();
    const adRecordId = new RecordId(DBTables.advertisement, adId);
    const userRecordI = new RecordId(DBTables.user, session.value.user.id);

    try {
        const result = await db.select<DiscussionDB>(DBTables.discussion)
            .where(and(
                eq("advertisement", adRecordId),
                or(
                    eq("advertisement.author", userRecordI),
                    eq("sender", userRecordI)
                )
            ))
            .fetch(...eagerFields);

        return {
            success: true,
            value: await convertDiscussionDB(...result)
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error("unknown db error")
        }
    }
    finally {
        await db.close();
    }
}