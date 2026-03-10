'use client';

import {Discussion} from "@/lib/types/discussion";
import AdvertisementCard from "@/app/(home)/profile/[userid]/components/advertisement-card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";
import {Send, SendHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {InputGroup, InputGroupTextarea} from "@/components/ui/input-group";
import {useRef, useState} from "react";

export interface DiscussionFeedProps {
    discussion: Discussion;
}

export function DiscussionFeed({discussion}: DiscussionFeedProps) {
    const [textAreaFocus, setTextAreaFocus] = useState(false);


    return (
        <div className={"flex flex-col gap-3 h-full"}>
            <AdvertisementCard className={"h-40 w-full"} advertisement={discussion.advertisement}/>
            <ScrollArea className={"h-full"}>
                {
                    discussion.messages.map(discussion => (
                        <div key={discussion.id}>
                            {discussion.text}
                        </div>
                    ))
                }
            </ScrollArea>
            <div className={"py-6 flex flex-row gap-3 items-center"}>
                <InputGroup>
                    <InputGroupTextarea className={`${textAreaFocus ? "min-h-32" : "min-h-80"}`} onBlur={() => setTextAreaFocus(false)} onFocus={() => setTextAreaFocus(true)}/>
                </InputGroup>
                <Button>
                    <SendHorizontal/>
                </Button>
            </div>
        </div>
    );
}