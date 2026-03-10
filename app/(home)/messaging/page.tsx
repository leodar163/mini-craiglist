import {getSession} from "@/app/actions/auth.actions";
import {getDiscussionsOfUser} from "@/app/actions/discussion.actions";
import PageLayout from "@/components/ui/page-layout";
import {DiscussionFeed} from "@/app/(home)/messaging/discussion-feed";

export default async function messagingPage({searchParams}: {searchParams: Promise<{discussionId: string}>}) {
    const sessions = await getSession();
    if (!sessions.success) {
        return <>Veuillez vous connecter</>
    }

    const discussions = await getDiscussionsOfUser(sessions.value.user.id);
    if (!discussions.success) {
        console.error(discussions.error);
        return <>Erreur lors de la récupération des discussions</>
    }

    return (
        <PageLayout>
            <DiscussionFeed discussion={discussions.value[0]} />
        </PageLayout>
    )
}