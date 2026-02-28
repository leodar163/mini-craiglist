import {useState} from "react";
import {useRouter} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import {createAdvertisementSchema} from "@/lib/validation-schemas/create-advertisement-data";
import {AdvertisementModality, AdvertisementPricing, AdvertisementType} from "@/lib/types/advertisement";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea} from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export default function CreateAdvertisementForm() {
    const [validating, setValidating] = useState(false);
    const [globalError, setGlobalError] = useState<Error | null>(null);
    const router = useRouter();

    const form = useForm({
        resolver: valibotResolver(createAdvertisementSchema),
        defaultValues: {
            title: "",
            description: "",
            type: AdvertisementType.OFFER,
            town: "",
            availability: "",
            pricing: AdvertisementPricing.FREE,
            price: 0,
            modality: AdvertisementModality.AT_CUSTOMER,
            categories: []
        },
    });

    async function onSubmit() {

    }

    return (
        <Card className={"w-146"}>
            <CardHeader>
                <CardTitle>Créer une annonce</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    id={"create-advertisement-form"}
                    onSubmit={onSubmit}
                >
                    <Controller
                        name={"type"}
                        control={form.control}
                        render={({field, fieldState}) =>
                            <Field aria-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                                <Select
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                >
                                    <SelectTrigger>
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>type d&apos;annonce</SelectLabel>
                                            {Object.values(AdvertisementType).map((value, index) =>
                                                <SelectItem value={value} key={index}>value</SelectItem>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                            </Field>
                        }
                    />
                    <FieldGroup>
                        <Controller
                            name={"title"}
                            control={form.control}
                            render={({field, fieldState}) =>
                                <Field aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Titre</FieldLabel>
                                    <Input
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder={"Je veux aider"}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            }
                        />
                        <Controller
                            name={"description"}
                            control={form.control}
                            render={({field, fieldState}) =>
                                <Field aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            placeholder={"Propose de l'aide aux devoir..."}
                                        />
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            }
                        />
                        <Controller
                            name={"town"}
                            control={form.control}
                            render={({field, fieldState}) =>
                                <Field aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Ville</FieldLabel>
                                    <Input
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder={"Je veux aider"}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            }
                        />
                        <Controller
                            name={"availability"}
                            control={form.control}
                            render={({field, fieldState}) =>
                                <Field aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Disponibilités</FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            placeholder={"Propose de l'aide aux devoir..."}
                                        />
                                    </InputGroup>
                                    <FieldDescription>
                                        Expliquez à votre lecteur quand vous être disponible pour rendre
                                        service ou qu&apos;on vienne vous rendre service
                                    </FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            }
                        />
                        <Controller
                            name={"pricing"}
                            control={form.control}
                            render={({field, fieldState}) =>
                                <Field aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Type de Tarif</FieldLabel>
                                    <Select
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                    >
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>type d&apos;annonce</SelectLabel>
                                                {Object.values(AdvertisementPricing).map((value, index) =>
                                                    <SelectItem value={value} key={index}>value</SelectItem>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            }
                        />
                        {form.getValues("pricing") != AdvertisementPricing.FREE &&
                            <Controller
                                name={"price"}
                                control={form.control}
                                render={({field, fieldState}) =>
                                    <Field aria-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Tarif</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                type={"number"}
                                                aria-invalid={fieldState.invalid}
                                            />
                                        </InputGroup>
                                        <InputGroupAddon align={"inline-start"}>€</InputGroupAddon>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                    </Field>
                                }
                            />
                        }
                        <Controller
                            name={"modality"}
                            control={form.control}
                            render={({field, fieldState}) =>
                                <Field aria-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Modalité de déplacement</FieldLabel>
                                    <Select
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                    >
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>type d&apos;annonce</SelectLabel>
                                                {Object.values(AdvertisementModality).map((value, index) =>
                                                    <SelectItem value={value} key={index}>value</SelectItem>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                </Field>
                            }
                        />
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}