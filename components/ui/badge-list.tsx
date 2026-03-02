"use client";

import {Item, ItemContent, ItemTitle} from "@/components/ui/item";
import {Badge} from "@/components/ui/badge";
import {useEffect, useState} from "react";
import {DeleteIcon} from "lucide-react";

export interface BadgeContainerProps<TValue> {
    title?: string;
    values: TValue[];
    toStringFn: (value: TValue) => string | number;
    canDelete: boolean;
    onValueChange?: (values: TValue[]) => void;
}

export default function BadgeList<TValue>({ title, values, toStringFn, canDelete = false, onValueChange }: BadgeContainerProps<TValue>) {
    const [items, setItems] = useState<TValue[]>(values);

    useEffect(() => {
        setItems(values);
    }, [values]);

    function deleteBadge(item: TValue) {
        const newItems = items.filter((i: TValue) => i !== item);
        setItems(newItems);
        onValueChange?.(newItems);
    }

    return (
        <Item variant="outline">
            <ItemContent>
                {title && <ItemTitle>{title}</ItemTitle>}
                <div className={"flex flex-wrap gap-1"}>
                    {items.map((item, index) => (
                        <Badge key={index}>
                            {toStringFn(item)}
                            {canDelete && <DeleteIcon onClick={() => deleteBadge(item)}/>}
                        </Badge>
                    ))}
                </div>
            </ItemContent>
        </Item>
    )
}