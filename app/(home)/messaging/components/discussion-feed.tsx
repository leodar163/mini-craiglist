'use client';

import {Discussion, Message} from "@/lib/types/discussion";
import AdvertisementCard from "@/app/(home)/profile/[userid]/components/advertisement-card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {SendHorizontal, User} from "lucide-react";
import {Button} from "@/components/ui/button";
import {InputGroup, InputGroupTextarea} from "@/components/ui/input-group";
import {Card} from "@/components/ui/card";
import Link from "next/link";
import {Session} from "@/lib/types/session";
import React, {useEffect, useRef, useState} from "react";
import {sendMessage} from "@/app/actions/discussion.actions";
import {FieldError} from "@/components/ui/field";

export interface DiscussionFeedProps {
    discussion: Discussion;
    session: Session;
}

export function DiscussionFeed({discussion, session}: DiscussionFeedProps) {
    const [message, setMessage] = useState("");
    const [messageError, setMessageError] = useState<Error | null>(null);
    const [messages, setMessages] = useState<Message[]>(discussion.messages);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    async function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key === "Enter") {
            event.preventDefault();
            setMessageError(null);

            if (message !== "") {
                const sendResult = await sendMessage(discussion.id, message);
                setMessage("");

                if (!sendResult.success) {
                    setMessageError(sendResult.error);
                    return;
                }
                setMessages(old => [...old, sendResult.value]);
            }
        }
    }

    function scrollToBottom() {
        const viewPort = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewPort) viewPort.scrollTop = viewPort.scrollHeight;
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (discussion.sender.id != session.user.id && discussion.receiver.id != session.user.id) {
        return <>
            Vous n&apos;avez pas accès à cette discussion...
        </>
    }

    return (
        <div className={"flex flex-col gap-3 h-full"} onKeyDown={onKeyDown}>
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
            <ScrollArea className={"flex-1 min-h-0"} ref={scrollAreaRef}>
                {
                    messages.map(message => (
                        <MessageCard key={message.id} message={message}
                                     isSender={message.senderId != session.user.id}/>
                    ))
                }
            </ScrollArea>
            <div className={"py-6"}>
                {
                    messageError != null && <FieldError errors={[messageError]}/>
                }
                <div className={"flex flex-row gap-3 items-center"}>
                    <InputGroup>
                        <InputGroupTextarea
                            className={"transition-all duration-200 focus:min-h-32 min-h-12"}
                            placeholder={"Envoyez un message à votre interlocuteur·rice..."}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </InputGroup>
                    <Button>
                        <SendHorizontal/>
                    </Button>
                </div>

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
        <Card className={`my-2 w-fit max-w-[45%] h-fit px-6 ${isSender ? "bg-foreground/5" : "justify-self-end"}`}>
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