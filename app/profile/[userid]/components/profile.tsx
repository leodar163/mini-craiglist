"use client";

import {User} from "@/lib/types/user";
import {Field, FieldGroup, FieldTitle} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";


export interface ProfileProps {
    user: User | null;
}

export default function Profile({user}: ProfileProps) {
    if (!user) {
        return <div className={"flex justify-center"}>
            Il semble que cette utilisateur n&#39;existe pas...
        </div>
    }
    return (
        <div>
            <h1>{user.pseudo}</h1>
            <FieldGroup>
                <Field>
                    <FieldTitle>Ville</FieldTitle>
                    <Input value={user.town}/>
                </Field>
                <Field>
                    <FieldTitle>Bio</FieldTitle>
                    <Textarea value={user.bio}/>
                </Field>
            </FieldGroup>
        </div>
    )
}