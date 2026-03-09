import {NextResponse} from "next/server";
import {searchForAdvertisement} from "@/app/actions/advertisement.actions";
import {AdvertisementCategory, AdvertisementPricing, AdvertisementType} from "@/lib/types/advertisement";

export async function GET() {

    const searchResult = await searchForAdvertisement({text: '', minPrice: 15});
    if (!searchResult.success) {
        return NextResponse.json(searchResult.error.message);
    }

    return NextResponse.json(searchResult.value);
}