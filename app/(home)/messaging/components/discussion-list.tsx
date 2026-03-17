"use client";

import {Discussion} from "@/lib/types/discussion";
import {Separator} from "@/components/ui/separator";
import {useDiscussionSubscription} from "@/app/hooks/dbSubscription";
import {useState} from "react";
import {DiscussionMininfo} from "@/app/(home)/messaging/components/discussion-mininfo";

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
            {localDiscussions.map((discussion: Discussion, index: number) =>
                [
                    <DiscussionMininfo discussion={discussion} key={index}
                                       className={currentDiscussionId === discussion.id ? "bg-foreground/10" : ""}/>,
                    <Separator key={"separator" + index}/>
                ]
            )}
        </div>
    );
}