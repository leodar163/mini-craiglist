"use client";

import {User} from "@/lib/types/user";
import {Field, FieldGroup, FieldTitle} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Advertisement} from "@/lib/types/advertisement";
import {useState} from "react";
import AdvertisementCard from "@/app/profile/[userid]/components/advertisement-card";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import CreateAdvertisementForm from "@/app/profile/[userid]/components/create-advertisement-form";


export interface ProfileProps {
    user: User | null;
    advertisements: Advertisement[];
}

export default function Profile({user, advertisements}: ProfileProps) {
    const [localeAdvertisements, setLocaleAdvertisements] = useState(advertisements);

    if (!user) {
        return <div className={"flex justify-center"}>
            Il semble que cette utilisateur n&#39;existe pas...
        </div>
    }
    return (
        <div>
            <h1>{user.pseudo}</h1>
            <FieldGroup title={"Informations"}>
                <Field>
                    <FieldTitle>Ville</FieldTitle>
                    <Input value={user.town}/>
                </Field>
                <Field>
                    <FieldTitle>Bio</FieldTitle>
                    <Textarea value={user.bio}/>
                </Field>
            </FieldGroup>
            <FieldGroup title={"Annonces"}>
                {localeAdvertisements.map((advertisement, index) => (
                    <AdvertisementCard advertisement={advertisement} key={index}/>
                ))}
                <CreateAdvertisementForm
                    afterSubmission={ad => setLocaleAdvertisements(old => [...old, ad])}
                />
            </FieldGroup>
        </div>
    )
}