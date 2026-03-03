import {getUser} from "@/app/actions/user.actions";
import Profile from "@/app/(home)/profile/[userid]/components/profile";
import {getAdvertisementsByUser} from "@/app/actions/advertisement.actions";
import {Advertisement} from "@/lib/types/advertisement";
import {getSession} from "@/app/actions/auth.actions";

export default async function ProfilePage({params}: {params: Promise<{userid: string}>}) {
    const {userid} = await params;

    const sessionResult = await getSession();

    if (!sessionResult.success) {
        return <>Veuillez vous connecter</>
    }

    const userResponse = await getUser(userid);
    const user = userResponse.success ? userResponse.value : null;

    const advertisementResponse = user == null ? null : await getAdvertisementsByUser(user?.id);
    let advertisements: Advertisement[] = [];

    if (advertisementResponse != null) {
        if (!advertisementResponse.success) {
            console.error(advertisementResponse.error);
        }
        else {
            advertisements = advertisementResponse.value;
        }
    }

    return <Profile session={sessionResult.value} user={user} advertisements={advertisements}/>
}