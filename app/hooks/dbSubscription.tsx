import {LiveAction} from "surrealdb";
import {useEffect} from "react";
import {Discussion, Message} from "@/lib/types/discussion";
import {cn} from "@/lib/utils";

export type DBFallBackContext = LiveAction;

export function useDiscussionSubscription(
    context: DBFallBackContext[],
    fallback: (discussion: Discussion) => void
) {
    useEffect(() => {
        const eventSource = new EventSource('api/live/discussion');

        eventSource.onerror = (event) => {
            console.error(event);
            eventSource.close();
        }

        eventSource.onmessage = (event) => {
            const {action, result}: { action: DBFallBackContext, result: Discussion } = JSON.parse(event.data);

            if (context.includes(action)) {
                fallback(result);
            }
        }

        return () => eventSource.close();
    }, [context, fallback]);
}


export function useMessageSubscription(
    context: DBFallBackContext,
    discussionId: string | undefined,
    fallback: (message: Message) => void
) {
    useEffect(() => {
        const eventSource = discussionId == null
            ? new EventSource('api/live/message')
            : new EventSource(`api/live/message/${discussionId}`);

        eventSource.onerror = event => {
            console.error(event);
            eventSource.close();
        };

        eventSource.onmessage = (event) => {
            const {action, result} : { action: DBFallBackContext, result: Message } = JSON.parse(event.data);

            if (context.includes(action)) {
                fallback(result);
            }
        }
        return () => eventSource.close();
    }, [context, discussionId, fallback]);
}