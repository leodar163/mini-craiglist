import {getSession} from "@/app/actions/auth.actions";
import {getDiscussionsOfUser} from "@/app/actions/discussion.actions";
import PageLayout from "@/components/ui/page-layout";
import {DiscussionFeed} from "@/app/(home)/messaging/components/discussion-feed";
import {DiscussionList} from "@/app/(home)/messaging/components/discussion-list";

export default async function messagingPage({searchParams}: {searchParams: Promise<{discussionId: string | undefined}>}) {
    const sessions = await getSession();
    if (!sessions.success) {
        return <>Veuillez vous connecter</>
    }

    const discussionResult = await getDiscussionsOfUser(sessions.value.user.id);
    if (!discussionResult.success) {
        console.error(discussionResult.error);
        return <>Erreur lors de la récupération des discussions</>
    }

    const discussions = discussionResult.value.sort((a, b) =>
        a.messages[a.messages.length - 1].createdAt.getTime() -
        b.messages[b.messages.length - 1].createdAt.getTime()
    );

    let {discussionId} = await searchParams;

    if (discussionId == null) discussionId = discussions[0].id;

    const currentDiscussion = discussions.find(d => d.id === discussionId);

    return (
        <PageLayout
        leftColumn={
            <DiscussionList discussions={discussions} currentDiscussionId={discussionId}/>
        }>
            <DiscussionFeed discussion={currentDiscussion} session={sessions.value}/>
        </PageLayout>
    )
}