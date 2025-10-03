import type {Entity} from "../../types/entity.types.ts";
import type {Address, Bank, Contact, Job} from "../../types/related.types.ts";
import {format} from "date-fns";

function toTitleCase(input: string): string {
    return input
        .split("_") // tách theo dấu gạch dưới
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

// Đây là hàm utility, không phải React.FC
export function reformatEntity(data: Entity): Entity {
    return {
        ...data,
        source_system: toTitleCase(data.source_system),
        created_date: format(new Date(data.created_date), "yyyy-MM-dd HH:MM:SS"),
        modified_date: format(new Date(data.modified_date), "yyyy-MM-dd HH:MM:SS"),
        extracted_date: format(new Date(data.extracted_date), "yyyy-MM-dd HH:MM:SS"),
        source_details: toTitleCase(data.source_details),
        place_of_birth: `${data.city_of_birth} (${data.province_of_birth}), ${data.region_of_birth}, ${data.country_of_birth}`,
        date_of_birth: format(new Date(data.date_of_birth), "yyyy-MM-dd"),
        date_of_death: data.date_of_death
            ? format(new Date(data.date_of_birth), "yyyy-MM-dd")
            : null,
    };
}

export function reformatAddress(data: Address): Address {
    return {
        ...data,
        source_system: toTitleCase(data.source_system),
        created_date: format(new Date(data.created_date), "yyyy-MM-dd HH:MM:SS"),
        modified_date: format(new Date(data.modified_date), "yyyy-MM-dd HH:MM:SS"),
        extracted_date: format(new Date(data.extracted_date), "yyyy-MM-dd HH:MM:SS"),
    };
}

export function reformatContact(data: Contact): Contact {
    return {
        ...data,
        source_system: toTitleCase(data.source_system),
        created_date: format(new Date(data.created_date), "yyyy-MM-dd HH:MM:SS"),
        modified_date: format(new Date(data.modified_date), "yyyy-MM-dd HH:MM:SS"),
        extracted_date: format(new Date(data.extracted_date), "yyyy-MM-dd HH:MM:SS"),
    };
}

export function reformatBank(data: Bank): Bank {
    return {
        ...data,
        source_system: toTitleCase(data.source_system),
        created_date: format(new Date(data.created_date), "yyyy-MM-dd HH:MM:SS"),
        modified_date: format(new Date(data.modified_date), "yyyy-MM-dd HH:MM:SS"),
        extracted_date: format(new Date(data.extracted_date), "yyyy-MM-dd HH:MM:SS"),
    };
}

export function reformatJob(data: Job): Job {
    return {
        ...data,
        source_system: toTitleCase(data.source_system),
        created_date: format(new Date(data.created_date), "yyyy-MM-dd HH:MM:SS"),
        modified_date: format(new Date(data.modified_date), "yyyy-MM-dd HH:MM:SS"),
        extracted_date: format(new Date(data.extracted_date), "yyyy-MM-dd HH:MM:SS"),
    };
}