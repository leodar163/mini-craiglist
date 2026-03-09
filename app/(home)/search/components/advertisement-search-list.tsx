import {Advertisement} from "@/lib/types/advertisement";
import AdvertisementCard from "@/app/(home)/profile/[userid]/components/advertisement-card";

export interface AdvertisementSearchListProps {
    advertisements: Advertisement[];
}

export default function AdvertisementSearchList({advertisements}: AdvertisementSearchListProps) {
    return (
        <div className={" flex flex-col gap-3 w-full h-fit "}>
            {advertisements.map((advertisement: Advertisement) => (
                <AdvertisementCard key={advertisement.id} advertisement={advertisement} className={"w-full h-44"}/>
            ))}
        </div>
    );
}