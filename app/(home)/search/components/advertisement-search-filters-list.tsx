"use client";

import {AdvertisementSearchFilters} from "@/app/actions/advertisement.actions";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Search} from "lucide-react";
import {useState} from "react";
import {useRouter} from "next/navigation";

export interface AdvertisementSearchFiltersListProps {
    resultNumber: number | undefined;
    initialFilters: AdvertisementSearchFilters
}

export default function AdvertisementSearchFiltersList({resultNumber, initialFilters}: AdvertisementSearchFiltersListProps) {
    const [filters, setFilters] = useState<AdvertisementSearchFilters>(initialFilters);
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

    return (
        <div className={"flex flex-wrap justify-center"}>
            <InputGroup>
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
        </div>
    );
}