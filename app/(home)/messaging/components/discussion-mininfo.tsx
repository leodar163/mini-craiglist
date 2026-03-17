import {Discussion, Message} from "@/lib/types/discussion";
import Link from "next/link";
import {cn} from "@/lib/utils";

export interface DiscussionCardProps {
    discussion: Discussion;
    className?: string;
}

export function DiscussionMininfo({discussion, className}: DiscussionCardProps) {
    const lastMessage: Message | undefined = discussion.messages[discussion.messages.length - 1];
    return (
        <Link
            className={cn(`rounded hover:bg-foreground/20 hover:cursor-pointer`, className)}
            href={"/messaging?discussionId=" + discussion.id}
        >
            <div className={"flex flex-col p-2"}>
                <div className={"font-bold truncate"}>{discussion.advertisement.title}</div>
                {lastMessage != null && [
                    <div
                        key={"name " + discussion.id}
                        className={"text-sm"}>de {lastMessage.senderId == discussion.sender.id ? discussion.sender.pseudo : discussion.receiver.pseudo}
                    </div>,
                    <div key={"text " + discussion.id} className={"text-xs truncate"}>
                        {lastMessage.text}
                    </div>,
                    <div key={"date " + discussion.id} className={"text-xs text-foreground/50"}>
                        {lastMessage.createdAt.toLocaleDateString()} - {lastMessage.createdAt.getHours().toLocaleString()}:{lastMessage.createdAt.getMinutes().toLocaleString()}
                    </div>
                ]}
            </div>
        </Link>
    );
}