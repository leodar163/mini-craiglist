import PageLayout from "@/components/ui/page-layout";
import {AdvertisementSearchFilters, searchForAdvertisement} from "@/app/actions/advertisement.actions";
import {getSession} from "@/app/actions/auth.actions";
import AdvertisementSearchFiltersList from "@/app/(home)/search/components/advertisement-search-filters-list";
import AdvertisementSearchList from "@/app/(home)/search/components/advertisement-search-list";
import {Separator} from "@/components/ui/separator";


export default async function SearchPage({searchParams}: { searchParams: Promise<AdvertisementSearchFilters> }) {
    const sessionResult = await getSession();
    if (!sessionResult.success) {
        return <>Veuillez vous connecter</>
    }

    const filters = await searchParams;
    if (filters.text == null) filters.text = "";
    if (filters.categories != null && !Array.isArray(filters.categories)) filters.categories = [filters.categories];
    if (filters.minPrice != null && typeof filters.minPrice === "string") filters.minPrice = Number(filters.minPrice);
    if (filters.maxPrice != null && typeof filters.maxPrice === "string") filters.maxPrice = Number(filters.maxPrice);

    const searchResult = await searchForAdvertisement(filters);

    if (!searchResult.success) {
        return searchResult.error;
    }

    return (
        <PageLayout title={"Chercher une annonce"}>
            <div className={"flex flex-col gap-3"}>
                <AdvertisementSearchFiltersList
                    resultNumber={searchResult.value.length > 0 ? searchResult.value.length : undefined}
                    initialFilters={filters}
                />
                <Separator/>
                <AdvertisementSearchList advertisements={searchResult.value}/>
            </div>
        </PageLayout>
    );
}