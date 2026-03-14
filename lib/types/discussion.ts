import {Common, CommonDB} from "@/lib/types/common";
import {convertUserDB, User, UserDB} from "@/lib/types/user";
import {Advertisement, AdvertisementDB, convertAdvertisementDB} from "@/lib/types/advertisement";
import {RecordId} from "surrealdb";
import {getMessagesOfDiscussion} from "@/app/actions/discussion.actions";

export interface Discussion extends Common {
    sender: User;
    receiver: User;
    advertisement: Advertisement;
    messages: Message[];
}

export interface DiscussionDB extends CommonDB {
    sender: UserDB;
    advertisement: AdvertisementDB;
}

export async function convertDiscussionDB(...discussions: DiscussionDB[]): Promise<Discussion[]> {
    return await Promise.all(discussions.map(discussion => convertDiscussionDBUnique(discussion)));
}

async function convertDiscussionDBUnique(discussion: DiscussionDB): Promise<Discussion> {
    const receiver = discussion.advertisement.author;

    const messages = await getMessagesOfDiscussion(discussion.id.id.toString());
    if (!messages.success) {
        throw messages.error;
    }

    return {
        ...discussion,
        id: discussion.id.id.toString(),
        createdAt: discussion.createdAt.toDate(),
        updatedAt: discussion.updatedAt.toDate(),
        sender: convertUserDB(discussion.sender)[0],
        receiver: convertUserDB(receiver)[0],
        advertisement: convertAdvertisementDB(discussion.advertisement)[0],
        messages: messages.value,
    }
}

export interface Message extends Common {
    senderId: string;
    discussionId: string;
    text: string;
}

export interface MessageDB extends CommonDB {
    sender: RecordId;
    discussion: RecordId;
    text: string;
}

export function convertMessageDB(...messages: MessageDB[]): Message[] {
    return messages.map(message => (
        {
            id: message.id.id.toString(),
            createdAt: message.createdAt.toDate(),
            updatedAt: message.updatedAt.toDate(),
            text: message.text,
            discussionId: message.discussion.id.toString(),
            senderId: message.sender.id.toString(),
        }
    ));
}