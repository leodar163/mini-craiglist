"use client";

import {Discussion, Message} from "@/lib/types/discussion";
import Link from "next/link";
import {Separator} from "@/components/ui/separator";
import {useDiscussionSubscription} from "@/app/hooks/dbSubscription";
import {useState} from "react";

export interface DiscussionListProps {
    discussions: Discussion[];
    currentDiscussionId: string;
}

export function DiscussionList({discussions, currentDiscussionId}: DiscussionListProps) {
    const [localDiscussions, setLocalDiscussions] = useState<Discussion[]>(discussions);

    useDiscussionSubscription(['CREATE'], discussion => {
        setLocalDiscussions(old => [...old, discussion]);
    });

    return (
        <div className={"flex flex-col p-2 gap-2"}>
            <div className={"text-xl text-foreground/30 mb-1"}>Discussions</div>
            {localDiscussions.map((discussion: Discussion, index: number) => {

                const lastMessage: Message | undefined = discussion.messages[discussion.messages.length - 1];
                return [
                    <Link
                        className={`rounded hover:bg-foreground/20 hover:cursor-pointer ${currentDiscussionId === discussion.id ? "bg-foreground/10" : ""}`}
                        key={index}
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
                    </Link>,
                    <Separator key={"separator" + index}/>
                ]
            })}
        </div>
    );
}