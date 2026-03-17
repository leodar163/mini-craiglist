import {getSession} from "@/app/actions/auth.actions";
import AdvertisementDetail from "@/app/(home)/advertisement/[adId]/components/AdvertisementDetail";
import {getAdvertisement} from "@/app/actions/advertisement.actions";
import {getDiscussionOfAdvertisement} from "@/app/actions/discussion.actions";

export default async function AdvertisementPage({params}: { params: Promise<{ adId: string }> }) {
    const sessionResult = await getSession();
    if (!sessionResult.success) {
        return <>Veuillez vous connecter</>
    }

    const {adId} = await params;
    const ad = await getAdvertisement(adId);

    if (!ad.success) {
        return <>Cette annonce n&apos;existe pas</>
    }

    const discussionsResult = await getDiscussionOfAdvertisement(adId);
    if (!discussionsResult.success) {
        console.error(discussionsResult.error)
        return <>erreur lors de la récupération des discussions liées à cette annonce</>
    }

    return (
        <AdvertisementDetail
            advertisement={ad.value}
            discussions={discussionsResult.value}
            session={sessionResult.value}/>
    );
}