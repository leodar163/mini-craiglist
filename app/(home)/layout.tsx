import {ReactNode} from "react";
import {BugIcon, LogOutIcon, UserIcon} from "lucide-react";
import Link from "next/link";
import {getSession, logout} from "@/app/actions/auth.actions";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";

export default async function HomeLayout({ children }: { children: ReactNode }) {
    const session = await getSession();
    const user = session.success ? session.value.user : session.error;
    return <div className={"w-vh-100 h-dvh "}>
        <div className={"flex flew-row px-2 py-1 w-full h-16 rounded-b-md border"}>
            <div className={"w-full h-full"}></div>
            {(user instanceof Error)  ? (
                <Tooltip>
                    <TooltipTrigger render={<BugIcon/>}/>
                    <TooltipContent>
                        {user.message}
                    </TooltipContent>
                </Tooltip>
            ) : (
                <div className={"flex flex-row gap-3 h-full items-center"}>
                    <Link href={`/profile/${user.id}`}>
                        <UserIcon className={"w-10 h-10 p-1 bg-secondary hover:bg-foreground/10 rounded-lg"}/>
                    </Link>
                    <div>
                        <Button onClick={logout} variant={"outline"}><LogOutIcon/> se déconnecter</Button>
                    </div>
                </div>
            )}
        </div>
        <div className="flex-1 overflow-auto">
            {children}
        </div>
    </div>;
}