import {
    Advertisement,
    AdvertisementPricing,
    translateAdvertisementCategory,
    translateAdvertisementType
} from "@/lib/types/advertisement";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {MapPinIcon} from "lucide-react";
import Link from "next/link";

export interface AdvertisementCardProps {
    advertisement: Advertisement;
}

export default function AdvertisementCard({advertisement}: AdvertisementCardProps) {
    return (
        <Link href={`/advertisement/${advertisement.id}`}>
            <Card className={"w-48 h-48 hover:bg-foreground/5 cursor-pointer"}>
                <CardHeader>
                    <CardTitle className={"text-xl"}>
                        {advertisement.title}
                    </CardTitle>
                    <div className={"text-xs"}>
                        {translateAdvertisementType(advertisement.type)}
                        {advertisement.pricing != AdvertisementPricing.FREE ? ` - ${advertisement.price}€` : " - gratuit"}
                        {advertisement.pricing == AdvertisementPricing.HOURLY && " par heure"}
                    </div>
                    <div className={"text-xs flex flew-row gap-1"}>
                        <MapPinIcon className={"w-4 h-4"}/> {advertisement.town}
                    </div>
                </CardHeader>
                <CardContent >
                    <div className={"flex flex-wrap gap-1"}>
                        {advertisement.categories.map(category => (
                            <Badge key={category} variant={"secondary"}>
                                {translateAdvertisementCategory(category)}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}