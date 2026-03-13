'use client';

import {Discussion, Message} from "@/lib/types/discussion";
import AdvertisementCard from "@/app/(home)/profile/[userid]/components/advertisement-card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {SendHorizontal, User} from "lucide-react";
import {Button} from "@/components/ui/button";
import {InputGroup, InputGroupTextarea} from "@/components/ui/input-group";
import {Card} from "@/components/ui/card";
import {Session} from "node:inspector";
import Link from "next/link";

export interface DiscussionFeedProps {
    discussion: Discussion;
    session: Session;
}

export function DiscussionFeed({discussion, session}: DiscussionFeedProps) {
    return (
        <div className={"flex flex-col gap-3 h-full"}>
            <AdvertisementCard className={"h-40 w-full"} advertisement={discussion.advertisement}/>
            <div className={"w-full flex flex-row gap-6 py-4 justify-between"}>
                <Link className={"hover:underline hover:cursor-pointer"}
                      href={`/profile/${discussion.sender.id}`}>
                    <div className={"flex flex-row gap-2"}>
                        <User className={"rounded-4xl bg-secondary"}/>
                        {discussion.sender.pseudo}<span className={"text-foreground/50"}>- intéressé·e</span>
                    </div>
                </Link>
                <Link className={"hover:underline hover:cursor-pointer"}
                      href={`/profile/${discussion.receiver.id}`}>
                    <div className={"flex flex-row gap-2"}>
                        <User className={"rounded-4xl bg-secondary"}/>
                        {discussion.receiver.pseudo}<span className={"text-foreground/50"}>- annonceur·euse</span>
                    </div>
                </Link>
            </div>
            <ScrollArea className={"h-full"}>
                {
                    discussion.messages.map(message => (
                        <MessageCard key={message.id} message={message}
                                     isSender={message.senderId == discussion.sender.id}/>
                    ))
                }
            </ScrollArea>
            <div className={"py-6 flex flex-row gap-3 items-center"}>
                <InputGroup>
                    <InputGroupTextarea
                        className={"transition-all duration-200 focus:min-h-32 min-h-12"}
                    />
                </InputGroup>
                <Button>
                    <SendHorizontal/>
                </Button>
            </div>
        </div>
    );
}

interface MessageCardProps {
    message: Message;
    isSender: boolean;
}

function MessageCard({message, isSender}: MessageCardProps) {
    return (
        <Card className={`w-fit max-w-[45%] h-fit px-6 ${isSender ? "bg-foreground/5" : "justify-self-end"}`}>
            <div className={"flex flex-col gap-2"}>
                {message.text}
                <div className={"w-full text-xs text-foreground/50 text-end"}>
                    {message.createdAt.toLocaleDateString()} -
                    {message.createdAt.getHours().toLocaleString()}:{message.createdAt.getMinutes().toLocaleString()}
                </div>
            </div>
        </Card>
    );
}