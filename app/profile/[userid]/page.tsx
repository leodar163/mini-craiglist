import {getUser} from "@/app/actions/user.actions";
import Profile from "@/app/profile/[userid]/components/profile";
import {getAdvertisementsByUser} from "@/app/actions/advertisement.actions";
import {Advertisement} from "@/lib/types/advertisement";
import PageLayout from "@/components/ui/page-layout";

export default async function ProfilePage({params}: {params: Promise<{userid: string}>}) {
    const {userid} = await params;

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

    return <Profile user={user} advertisements={advertisements}/>
}