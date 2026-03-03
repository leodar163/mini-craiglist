import {getSession} from "@/app/actions/auth.actions";
import {getAdvertisement, getAdvertisementsAuthor} from "@/app/actions/advertisement.actions";
import AdvertisementDetail from "@/app/(home)/advertisement/[adId]/components/AdvertisementDetail";

export default async function AdvertisementPage({params}: {params: Promise<{adId: string}>}) {
    const sessionResult = await getSession();
    if (!sessionResult.success) {
        return <>Veuillez vous connecter</>
    }

    const {adId} = await params;
    const ad = await getAdvertisement(adId);
    
    if (!ad.success) {
        return <>Cette annonce n&apos;existe pas</>
    }
    
    const author = await getAdvertisementsAuthor(adId);
    
    if (!author.success) {
        return <>Cette annonce n&apos;existe pas ou n&apos;a pas d&apos;auteur</>
    }

    return (
      <AdvertisementDetail 
          advertisement={ad.value} 
          author={author.value} 
          session={sessionResult.value}/>
    );
}