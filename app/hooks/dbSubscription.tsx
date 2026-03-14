import {LiveAction} from "surrealdb";
import {useEffect} from "react";
import {Discussion} from "@/lib/types/discussion";

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