import {Advertisement} from "@/lib/types/advertisement";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

export interface AdvertisementCardProps {
    advertisement: Advertisement;
}

export default function AdvertisementCard({ advertisement }: AdvertisementCardProps) {
    return (
        <Card className={"w-48"}>
            <CardHeader>
                <CardTitle>
                    {advertisement.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={"grid gap-2"}>
                    {advertisement.categories.map(category => (
                        <Badge key={category}>
                            {category}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}