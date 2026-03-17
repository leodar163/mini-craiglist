'use client';

import {
    Advertisement, AdvertisementPricing,
    AdvertisementStatus, AdvertisementType,
    translateAdvertisementCategory, translateAdvertisementModality,
    translateAdvertisementStatus, translateAdvertisementType
} from "@/lib/types/advertisement";
import {useMemo, useState} from "react";
import {Session} from "@/lib/types/session";
import {User} from "@/lib/types/user";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
    deleteAdvertisement,
    publishAdvertisement,
    restoreAdvertisement,
} from "@/app/actions/advertisement.actions";
import {Spinner} from "@/components/ui/spinner";
import {Item, ItemContent} from "@/components/ui/item";
import {Mail, MapPinIcon} from "lucide-react";
import PageLayout from "@/components/ui/page-layout";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import UpdateAdvertisementForm from "@/app/(home)/advertisement/[adId]/components/update-advertisement-form";
import Link from "next/link";
import {Discussion} from "@/lib/types/discussion";
import {useRouter} from "next/navigation";
import {createDiscussion} from "@/app/actions/discussion.actions";
import {DiscussionMininfo} from "@/app/(home)/messaging/components/discussion-mininfo";

export interface AdvertisementDetailProps {
    advertisement: Advertisement;
    discussions: Discussion[];
    session: Session;
}

export default function AdvertisementDetail({advertisement, discussions, session}: AdvertisementDetailProps) {
    const [localAdvertisement, setLocalAdvertisement] = useState(advertisement);
    const [archiveError, setArchiveError] = useState<Error | null>(null);
    const [discussionError, setDiscussionError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const sessionIsAuthor = useMemo(() =>
            session.user.id == localAdvertisement.author.id,
        [session, localAdvertisement.author]
    );

    if (!sessionIsAuthor && advertisement.status != AdvertisementStatus.PUBLISHED) {
        return <>Cette annonce n&apos;existe plus ou n&apos;est pas encore publiée et vous n&apos;en êtes pas
            l&apos;auteur</>
    }

    async function onDelete() {
        setArchiveError(null);
        setIsLoading(true);
        const deleteResult = await deleteAdvertisement(advertisement.id);
        if (!deleteResult.success) {
            setArchiveError(deleteResult.error);
            return;
        }
        setIsLoading(false);
        setLocalAdvertisement(old => ({...old, status: AdvertisementStatus.ARCHIVED}));
    }

    async function onRestore() {
        setArchiveError(null);
        setIsLoading(true);
        const restoreResult = await restoreAdvertisement(advertisement.id);
        if (!restoreResult.success) {
            setArchiveError(restoreResult.error);
            return;
        }
        setIsLoading(false);
        setLocalAdvertisement(old => ({...old, status: AdvertisementStatus.DRAFT}));
    }

    async function onPublish() {
        setArchiveError(null);
        setIsLoading(true);
        const publishResult = await publishAdvertisement(advertisement.id);
        if (!publishResult.success) {
            setArchiveError(publishResult.error);
            return;
        }
        setIsLoading(false);
        setLocalAdvertisement(old => ({...old, status: AdvertisementStatus.PUBLISHED}));
    }

    async function onSendingMessage() {
        let discussionId = discussions[0]?.id;

        if (discussionId == null) {
            setDiscussionError(null);

            const discussionResult = await createDiscussion({
                sender: session.user,
                advertisement: advertisement,
            })

            if (!discussionResult.success) {
                console.error(discussionResult.error);
                setDiscussionError(discussionResult.error);
                return;
            }

            discussionId = discussionResult.value.id;
        }

        router.push(`/messaging?discussionId=${discussionId}`);
    }

    return (
        <PageLayout>
            <div className={"flex flex-col mb-16 w-124"}>
                <div className={"text-xl text-foreground/30"}>Annonce</div>
                <FieldGroup className={"mb-40"}>
                    <Field orientation={"horizontal"} className={"gap-4"}>
                        <div className={"text-2xl"}>{localAdvertisement.title}</div>
                        {
                            sessionIsAuthor && <Badge variant={
                                (() => {
                                    switch (localAdvertisement.status) {
                                        case AdvertisementStatus.DRAFT:
                                            return "secondary";
                                        case AdvertisementStatus.PUBLISHED:
                                            return "outline";
                                        case AdvertisementStatus.ARCHIVED:
                                            return "destructive";
                                    }
                                })()
                            }>
                                {translateAdvertisementStatus(localAdvertisement.status)}
                            </Badge>
                        }
                        {
                            sessionIsAuthor && <Tooltip>
                                <TooltipTrigger
                                    render={
                                        <UpdateAdvertisementForm
                                            advertisement={localAdvertisement}
                                            afterSubmission={setLocalAdvertisement}
                                        />
                                    }
                                />
                                <TooltipContent>
                                    Modifier
                                </TooltipContent>
                            </Tooltip>
                        }
                    </Field>
                    <Field>
                        <FieldLabel>
                            Crée le
                            <span className={"text-foreground/50"}>
                                {localAdvertisement.createdAt.toLocaleDateString()}
                            </span>
                            par <Link className={"underline hover:text-foreground/75"}
                                      href={`/profile/${localAdvertisement.author.id}`}>{localAdvertisement.author.pseudo}</Link>
                        </FieldLabel>
                    </Field>
                    <Field orientation={"horizontal"} className={"gap-4"}>
                        {
                            sessionIsAuthor && advertisement.status === AdvertisementStatus.DRAFT &&
                            <div className={"flex flex-col"}>
                                <Button
                                    onClick={onPublish}
                                >
                                    {isLoading && <Spinner/>}
                                    publier
                                </Button>
                                {archiveError && <FieldError errors={[archiveError]}/>}
                            </div>
                        }
                        {
                            sessionIsAuthor && advertisement.status === AdvertisementStatus.ARCHIVED &&
                            <div className={"flex flex-col"}>
                                <Button
                                    variant={"secondary"}
                                    onClick={onRestore}
                                >
                                    {isLoading && <Spinner/>}
                                    restaurer
                                </Button>
                                {archiveError && <FieldError errors={[archiveError]}/>}
                            </div>
                        }
                        {
                            sessionIsAuthor && advertisement.status !== AdvertisementStatus.ARCHIVED &&
                            <div className={"flex flex-col"}>
                                <Button
                                    variant={"destructive"}
                                    onClick={onDelete}
                                >
                                    {isLoading && <Spinner/>}
                                    supprimer
                                </Button>
                                {archiveError && <FieldError errors={[archiveError]}/>}
                            </div>
                        }
                        {
                            !sessionIsAuthor && <div>
                                <Button
                                    variant={"outline"}
                                    onClick={onSendingMessage}
                                >
                                    <Mail/>
                                    Envoyer un message
                                </Button>
                                {discussionError &&
                                    <FieldError errors={[discussionError]}/>
                                }
                            </div>
                        }
                    </Field>
                    <Field orientation={"horizontal"}>
                        <div className={"text-lg"}>Type</div>
                        {translateAdvertisementType(localAdvertisement.type)}
                    </Field>
                    <Field>
                        <FieldLabel>Catégories</FieldLabel>
                        <Item variant={"outline"}>
                            <ItemContent>
                                <div className={"flex flex-wrap gap-3"}>
                                    {localAdvertisement.categories.map((category, index) => (
                                        <Badge key={index}
                                               variant={"secondary"}>
                                            {translateAdvertisementCategory(category)}
                                        </Badge>
                                    ))}
                                </div>
                            </ItemContent>
                        </Item>
                    </Field>
                    <Field>
                        <FieldLabel>Lieu</FieldLabel>
                        <div className={"flex flex-row gap-2"}>
                            <MapPinIcon className={"w-6 h-6"}/>
                            {localAdvertisement.town}<span
                            className={"text-foreground/50"}> - {translateAdvertisementModality(localAdvertisement.modality)}</span>
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>Disponibilités</FieldLabel>
                        <Item variant={"outline"}>
                            <ItemContent>
                                {localAdvertisement.availability}
                            </ItemContent>
                        </Item>
                    </Field>
                    <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Item variant={"outline"}>
                            <ItemContent>
                                {localAdvertisement.description}
                            </ItemContent>
                        </Item>
                    </Field>
                    <Field>
                        <FieldLabel>Tarif</FieldLabel>
                        <div className={"text-ms"}>
                            {(() => {
                                switch (localAdvertisement.type) {
                                    case AdvertisementType.OFFER:
                                        return "demande : "
                                    case AdvertisementType.REQUEST:
                                        return "propose : "
                                }
                            })()}
                            {localAdvertisement.pricing != AdvertisementPricing.FREE ? `${localAdvertisement.price}€` : "gratuit"}
                            {localAdvertisement.pricing == AdvertisementPricing.HOURLY && " par heure"}
                        </div>
                    </Field>
                    {sessionIsAuthor &&
                        <Field>
                            <FieldLabel key={"title"}>Discussions</FieldLabel>
                            <div className={"flex flex-wrap gap-3"}>
                                {
                                    discussions.map((discussion, index) => (
                                        <DiscussionMininfo
                                            discussion={discussion}
                                            key={index}
                                            className={"border rounded-lg"}
                                        />
                                    ))
                                }
                            </div>
                        </Field>
                    }
                </FieldGroup>
            </div>
        </PageLayout>
    )
}