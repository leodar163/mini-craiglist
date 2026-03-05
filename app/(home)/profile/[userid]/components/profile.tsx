"use client";

import {UpdateUser, User} from "@/lib/types/user";
import {Field, FieldGroup, FieldLabel, FieldTitle} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Advertisement} from "@/lib/types/advertisement";
import {useMemo, useState} from "react";
import AdvertisementCard from "@/app/(home)/profile/[userid]/components/advertisement-card";
import CreateAdvertisementForm from "@/app/(home)/profile/[userid]/components/create-advertisement-form";
import PageLayout from "@/components/ui/page-layout";
import {updateUser} from "@/app/actions/user.actions";
import {InputGroup, InputGroupTextarea} from "@/components/ui/input-group";
import {Session} from "@/lib/types/session";


export interface ProfileProps {
    session: Session;
    user: User | null;
    advertisements: Advertisement[];
}

export default function Profile({session, user, advertisements}: ProfileProps) {
    const [localeAdvertisements, setLocaleAdvertisements] = useState(advertisements);
    const [localUser, setLocalUser] = useState<User | null>(user);
    const [oldUser, setOldUser] = useState<User | null>(localUser);
    const sessionIsUser = useMemo<boolean>(() => localUser?.id == session.user.id, [localUser, session]);

    async function onUpdateUser(update: UpdateUser) {
        if (localUser == null) return;

        console.log(update);

        const result = await updateUser(localUser.id, update);

        if (!result.success) {
            setLocalUser(oldUser);
            return;
        }

        setLocalUser(result.value);
        setOldUser(result.value);
    }

    if (!localUser) {
        return <div className={"flex justify-center"}>
            Il semble que cette utilisateur n&#39;existe pas...
        </div>
    }

    return (
        <PageLayout titre={"Profil"}>
            <div className={"flex flex-col gap-10 justify-center"}>
                <div className={"text-2xl"}>{localUser.pseudo}</div>
                <FieldGroup className={"max-w-126"}>
                    <Field>
                        <FieldLabel>
                            inscrit depuis le
                            <span className={"text-foreground/50"}>
                                {localUser.createdAt.getDay()}/{localUser.createdAt.getMonth()}/{localUser.createdAt.getFullYear()}
                            </span>
                        </FieldLabel>
                    </Field>
                    <Field>
                        <FieldLabel>Ville</FieldLabel>
                        <Input
                            disabled={!sessionIsUser}
                            value={localUser.town}
                            onChange={event => setLocalUser({...localUser, town: event.target.value})}
                            onValidate={value => onUpdateUser({town: value})}
                            onCancel={() => setLocalUser(oldUser)}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>Bio</FieldLabel>
                        <InputGroup>
                            <InputGroupTextarea
                                disabled={!sessionIsUser}
                                value={localUser.bio}
                                onChange={event => setLocalUser({...localUser, bio: event.target.value})}
                                onValidate={value => onUpdateUser({bio: value})}
                                onCancel={() => setLocalUser(oldUser)}
                            />
                        </InputGroup>
                    </Field>
                </FieldGroup>
                <FieldGroup>
                    <FieldTitle>
                        <div className={"text-lg"}>Annonces</div>
                        {sessionIsUser &&
                            <div>
                                <CreateAdvertisementForm
                                    afterSubmission={ad => setLocaleAdvertisements(old => [...old, ad])}
                                />
                            </div>
                        }
                    </FieldTitle>
                    <div className={"flex flex-wrap gap-4"}>
                        {localeAdvertisements.length > 0
                            ? localeAdvertisements.map((advertisement, index) => (
                                <AdvertisementCard advertisement={advertisement} key={index}/>
                            ))
                            : "Aucune annonce"
                        }
                    </div>
                </FieldGroup>
            </div>
        </PageLayout>
    )
}