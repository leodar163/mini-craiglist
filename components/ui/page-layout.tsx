import {ReactNode} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";

export interface PageLayoutProps {
    titre?: string;
    children?: ReactNode;
}

export default function PageLayout({titre, children}: PageLayoutProps) {
    return (
        <div className={"flex flex-row h-dvh w-full"}>
            <div className={"flex-1"}>
            </div>
            <div className={"flex-4 flex flex-col"}>
                <ScrollArea className={"overflow-y-hidden pt-4 max-h-full pr-3"}>
                    {titre &&
                        <div className={"text-2xl mb-4 "}>
                            {titre}
                        </div>
                    }
                    {children}
                </ScrollArea>
            </div>
            <div className={"flex-1 "}></div>
        </div>
    )
}