import {ReactNode} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";

export interface PageLayoutProps {
    title?: string;
    rightColumn?: ReactNode;
    leftColumn?: ReactNode;
    children?: ReactNode;
}

export default function PageLayout({title, leftColumn, rightColumn, children}: PageLayoutProps) {
    return (
        <div className={"flex flex-row h-full w-full"}>
            <div className={"flex-1 min-w-0"}>
                {leftColumn}
            </div>
            <div className={"flex-4 flex flex-col min-h-0"}>
                <ScrollArea className={"overflow-y-hidden pt-4 h-dvh pr-3"}>
                    {title &&
                        <div className={"text-xl text-foreground/30"}>
                            {title}
                        </div>
                    }
                    <div className={"h-full"}>
                        {children}
                    </div>
                </ScrollArea>
            </div>
            <div className={"flex-1 min-w-0"}>
                {rightColumn}
            </div>
        </div>
    )
}