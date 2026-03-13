import {Discussion} from "@/lib/types/discussion";
import Link from "next/link";
import {Separator} from "@/components/ui/separator";

export interface DiscussionListProps {
    discussions: Discussion[];
    currentDiscussionId: string;
}

export function DiscussionList({discussions, currentDiscussionId}: DiscussionListProps) {
    return (
        <div className={"flex flex-col p-2 gap-2"}>
            <div className={"text-xl text-foreground/30 mb-1"}>Discussions</div>
            {discussions.map((discussion: Discussion, index: number) => {
                const lastMessage = discussion.messages[discussion.messages.length - 1];
                return [
                    <Link
                        className={`rounded hover:bg-foreground/20 hover:cursor-pointer ${currentDiscussionId === discussion.id ? "bg-foreground/10" : ""}`}
                        key={index}
                        href={"/messaging?discussionId=" + discussion.id}
                    >
                        <div className={"flex flex-col p-2"}>
                            <div className={"font-bold truncate"}>{discussion.advertisement.title}</div>
                            <div className={"text-sm"}>de {lastMessage.senderId == discussion.sender.id ? discussion.sender.pseudo : discussion.receiver.pseudo}</div>
                            <div className={"text-xs truncate"}>
                                {lastMessage.text}
                            </div>
                            <div className={"text-xs text-foreground/50"}>
                                {lastMessage.createdAt.toLocaleDateString()} - {lastMessage.createdAt.getHours().toLocaleString()}:{lastMessage.createdAt.getMinutes().toLocaleString()}
                            </div>
                        </div>
                    </Link>,
                    <Separator key={"separator" + index}/>
                ]
            })}
        </div>
    );
}