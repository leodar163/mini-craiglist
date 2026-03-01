import {useState} from "react";
import {useRouter} from "next/navigation";
import {Controller, useForm, useWatch} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import {CreateAdvertisementData, createAdvertisementSchema} from "@/lib/validation-schemas/create-advertisement-data";
import {
    Advertisement,
    AdvertisementModality,
    AdvertisementPricing,
    AdvertisementType, translateAdvertisementModality, translateAdvertisementPricing,
    translateAdvertisementType
} from "@/lib/types/advertisement";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
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
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {createAdvertisement} from "@/app/actions/advertisement.actions";
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";

export interface CreateAdvertisementFormProps {
    afterSubmission?: (advertisement: Advertisement) => void;
}

export default function CreateAdvertisementForm({afterSubmission}: CreateAdvertisementFormProps) {
    const [validating, setValidating] = useState(false);
    const [globalError, setGlobalError] = useState<Error | null>(null);
    const [open, setOpen] = useState<boolean>(false);
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

    const watchedPricing = useWatch({
        control: form.control,
        name: "pricing"
    });

    async function onSubmit(data: CreateAdvertisementData) {
        setValidating(true);
        setGlobalError(null);

        const advertisementResult = await createAdvertisement({...data});

        if (!advertisementResult.success) {
            setGlobalError(advertisementResult.error);
            setValidating(false);
            return;
        }

        setValidating(false);
        setOpen(false);
        afterSubmission?.(advertisementResult.value);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>créer une annonce</Button>
            </DialogTrigger>
            <form
                id={"create-advertisement-form"}
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <DialogContent className={"h-9/10"}>
                    <DialogHeader>
                        <DialogTitle>Créer une annonce</DialogTitle>
                    </DialogHeader>
                    <div className={"no-scrollbar overflow-y-auto rounded-md"}>
                        <FieldGroup>
                            <Controller
                                name={"type"}
                                control={form.control}
                                render={({field, fieldState}) =>
                                    <Field aria-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                                        <Select
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            aria-invalid={fieldState.invalid}
                                        >
                                            <SelectTrigger aria-invalid={fieldState.invalid}>
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>type d&apos;annonce</SelectLabel>
                                                    {Object.values(AdvertisementType).map((value, index) =>
                                                        <SelectItem
                                                            value={value}
                                                            key={index}>
                                                            {translateAdvertisementType(value)}
                                                        </SelectItem>
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                    </Field>
                                }
                            />
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
                                            Expliquez à votre lecteur quand vous êtes disponible pour rendre
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
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            aria-invalid={fieldState.invalid}
                                        >
                                            <SelectTrigger aria-invalid={fieldState.invalid}>
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>type d&apos;annonce</SelectLabel>
                                                    {Object.values(AdvertisementPricing).map((value, index) =>
                                                        <SelectItem value={value} key={index}>
                                                            {translateAdvertisementPricing(value)}
                                                        </SelectItem>
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                    </Field>
                                }
                            />
                            {watchedPricing != AdvertisementPricing.FREE &&
                                <Controller
                                    name={"price"}
                                    control={form.control}
                                    render={({field, fieldState}) =>
                                        <Field aria-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name}>Tarif</FieldLabel>
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    onChange={event =>
                                                        field.onChange(event.target.value == ""
                                                            ? ""
                                                            : Number(event.target.value)
                                                        )
                                                    }
                                                    type={"number"}
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                <InputGroupAddon align={"inline-start"}>€</InputGroupAddon>
                                            </InputGroup>
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
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            aria-invalid={fieldState.invalid}
                                        >
                                            <SelectTrigger aria-invalid={fieldState.invalid}>
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>type d&apos;annonce</SelectLabel>
                                                    {Object.values(AdvertisementModality).map((value, index) =>
                                                        <SelectItem value={value} key={index}>
                                                            {translateAdvertisementModality(value)}
                                                        </SelectItem>
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                                    </Field>
                                }
                            />
                        </FieldGroup>
                    </div>
                    <CardFooter className={"flex flex-row gap-4 justify-start"}>
                        <Button disabled={validating} type={"submit"} form={"create-advertisement-form"}>
                            {validating && <Spinner data-icon="inline-start"/>}
                            créer
                        </Button>
                        <DialogClose asChild>
                            <Button variant={"outline"}>annuler</Button>
                        </DialogClose>
                        {globalError && <FieldError errors={[globalError]}/>}
                    </CardFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}