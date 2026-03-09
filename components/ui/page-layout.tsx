import {ReactNode} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";

export interface PageLayoutProps {
    title?: string;
    children?: ReactNode;
}

export default function PageLayout({title, children}: PageLayoutProps) {
    return (
        <div className={"flex flex-row h-full w-full"}>
            <div className={"flex-1"}>
            </div>
            <div className={"flex-4 flex flex-col"}>
                <ScrollArea className={"overflow-y-hidden pt-4 max-h-full pr-3"}>
                    {title &&
                        <div className={"text-xl text-foreground/30"}>
                            {title}
                        </div>
                    }
                    {children}
                </ScrollArea>
            </div>
            <div className={"flex-1 "}></div>
        </div>
    )
}