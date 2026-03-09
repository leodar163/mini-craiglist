"use client";

import {AdvertisementSearchFilters} from "@/app/actions/advertisement.actions";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {MapPin, Search} from "lucide-react";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {Field, FieldLabel} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    AdvertisementCategory, AdvertisementPricing,
    AdvertisementType,
    translateAdvertisementCategory, translateAdvertisementPricing,
    translateAdvertisementType
} from "@/lib/types/advertisement";
import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList,
    ComboboxValue
} from "@/components/ui/combobox";

export interface AdvertisementSearchFiltersListProps {
    resultNumber: number | undefined;
    initialFilters: AdvertisementSearchFilters
}

export default function AdvertisementSearchFiltersList({
                                                           resultNumber,
                                                           initialFilters
                                                       }: AdvertisementSearchFiltersListProps) {
    const [filters, setFilters] = useState<AdvertisementSearchFilters>(initialFilters);
    const [categories, setCategories] = useState<AdvertisementCategory[]>([]);
    const router = useRouter();

    function changeFilters(newFilters: AdvertisementSearchFilters) {
        setFilters(newFilters);

        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(newFilters)) {
            if (value == null) continue;
            if (Array.isArray(value)) {
                value.forEach(item => params.append(key, item));
                continue;
            }
            params.append(key, value.toString());
        }

        router.replace(`/search?${params.toString()}`);
    }


    function changeCategories(newCategories: AdvertisementCategory[]) {
        setCategories(newCategories);
        changeFilters({...filters, categories: newCategories.length > 0 ? newCategories : undefined});
    }

    return (
        <div className={"flex flex-wrap gap-3"}>
            <InputGroup className={"w-88"}>
                <InputGroupInput
                    value={filters.text}
                    onValidate={value => changeFilters({...filters, text: value})}
                    placeholder={"chercher une annonce"}
                />
                <InputGroupAddon>
                    <Search/>
                </InputGroupAddon>
                {
                    resultNumber != null &&
                    <InputGroupAddon align={"inline-end"}>
                        <div className={"text-foreground/75"}>{resultNumber} résultats</div>
                    </InputGroupAddon>
                }
            </InputGroup>
            <InputGroup className={"w-52"}>
                <InputGroupInput
                    value={filters.town}
                    onValidate={value => changeFilters({...filters, town: value})}
                    placeholder={"filtrer par ville"}
                />
                <InputGroupAddon>
                    <MapPin/>
                </InputGroupAddon>
            </InputGroup>
            <Select
                name={"type"}
                value={filters.type ?? "none"}
                onValueChange={value => changeFilters({...filters, type: value == "none" ? undefined : value})}
            >
                <SelectTrigger>
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
                    <SelectGroup>
                        <SelectItem value={"none"}>tous les types</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Combobox
                multiple
                items={Object.values(AdvertisementCategory)}
                value={categories}
                onValueChange={changeCategories}
            >
                <ComboboxChips className={"w-64"}>
                    <ComboboxValue>
                        {categories.map(item => (
                            <ComboboxChip key={item}>
                                {translateAdvertisementCategory(item)}
                            </ComboboxChip>
                        ))}
                    </ComboboxValue>
                    <ComboboxChipsInput
                        placeholder={"selectionner une catégorie"}
                    />
                </ComboboxChips>
                <ComboboxContent className="z-9999">
                    <ComboboxEmpty>
                        Aucune catégorie restante
                    </ComboboxEmpty>
                    <ComboboxList>
                        {(item: AdvertisementCategory) => (
                            <ComboboxItem key={item} value={item}>
                                {translateAdvertisementCategory(item)}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
            <Select
                name={"pricing"}
                value={filters.pricing ?? "none"}
                onValueChange={value => changeFilters({...filters, pricing: value == "none" ? undefined : value})}
            >
                <SelectTrigger>
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>type d&apos;annonce</SelectLabel>
                        {Object.values(AdvertisementPricing).map((value, index) =>
                            <SelectItem
                                value={value}
                                key={index}>
                                {translateAdvertisementPricing(value)}
                            </SelectItem>
                        )}
                    </SelectGroup>
                    <SelectGroup>
                        <SelectItem value={"none"}>tous les tarifs</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <InputGroup className={"w-40"}>
                <InputGroupInput
                    value={filters.minPrice}
                    onValidate={value => changeFilters({...filters, minPrice: value == "" ? undefined : Number(value)})}
                    placeholder={"0"}
                />
                <InputGroupAddon>
                    prix minimum
                </InputGroupAddon>
                <InputGroupAddon align={"inline-end"}>
                    <div className={"text-foreground/50"}>€</div>
                </InputGroupAddon>
            </InputGroup>
            <InputGroup className={"w-40"}>
                <InputGroupInput
                    value={filters.maxPrice}
                    onValidate={value => changeFilters({...filters, maxPrice: value == "" ? undefined : Number(value)})}
                    placeholder={"0"}
                />
                <InputGroupAddon>
                    prix maximum
                </InputGroupAddon>
                <InputGroupAddon align={"inline-end"}>
                    <div className={"text-foreground/50"}>€</div>
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
}