import {Discussion} from "@/lib/types/discussion";

export interface DiscussionFeedProps {
    discussion: Discussion;
}

export function DiscussionFeed({ discussion }: DiscussionFeedProps) {
    return (
        <div className={"flex flex-col gap-3"}>
            {discussion.messages.map(discussion => (
                <div key={discussion.id}>
                    {discussion.text}
                </div>
            ))}
        </div>
    );
}