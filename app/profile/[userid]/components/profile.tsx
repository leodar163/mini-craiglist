"use client";

import {UpdateUser, User} from "@/lib/types/user";
import {Field, FieldGroup, FieldLabel, FieldTitle} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Advertisement} from "@/lib/types/advertisement";
import {useState} from "react";
import AdvertisementCard from "@/app/profile/[userid]/components/advertisement-card";
import CreateAdvertisementForm from "@/app/profile/[userid]/components/create-advertisement-form";
import PageLayout from "@/components/ui/page-layout";
import {updateUser} from "@/app/actions/user.actions";
import {InputGroup, InputGroupTextarea} from "@/components/ui/input-group";


export interface ProfileProps {
    user: User | null;
    advertisements: Advertisement[];
}

export default function Profile({user, advertisements}: ProfileProps) {
    const [localeAdvertisements, setLocaleAdvertisements] = useState(advertisements);
    const [localUser, setLocalUser] = useState<User | null>(user);
    const [oldUser, setOldUser] = useState<User | null>(localUser);

    async function onUpdateUser(update: UpdateUser) {
        if (localUser == null) return;

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
        <PageLayout titre={localUser.pseudo}>
            <div className={"flex flex-col gap-10 justify-center"}>
                <FieldGroup className={"max-w-126"}>
                    <Field>
                        <FieldLabel>Ville</FieldLabel>
                        <Input
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
                                value={localUser.bio}
                                onChange={event => setLocalUser({...localUser, bio: event.target.value})}
                                onValidate={value => onUpdateUser({bio: value})}
                                onCancel={() => setLocalUser(oldUser)}
                            />
                        </InputGroup>
                    </Field>
                </FieldGroup>
                <FieldGroup>
                    <div className={""}>
                        {localeAdvertisements.length > 0
                            ? localeAdvertisements.map((advertisement, index) => (
                                <AdvertisementCard advertisement={advertisement} key={index}/>
                            ))
                            : "Aucune annonce"
                        }
                    </div>
                    <div>
                        <CreateAdvertisementForm
                            afterSubmission={ad => setLocaleAdvertisements(old => [...old, ad])}
                        />
                    </div>
                </FieldGroup>
            </div>
        </PageLayout>
    )
}