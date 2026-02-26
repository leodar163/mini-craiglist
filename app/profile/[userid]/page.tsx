import {getUser} from "@/app/actions/user.actions";
import Profile from "@/app/profile/[userid]/components/profile";

export default async function ProfilePage({params}: {params: Promise<{userid: string}>}) {
    const {userid} = await params;

    const userResponse = await getUser(userid);

    const user = userResponse.success ? userResponse.value : null;

    return <div>
        <Profile user={user}/>
    </div>
}