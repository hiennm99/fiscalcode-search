import type {Entity} from "../types/entity.types.ts";
import type {Address, Bank, Contact, Job, Asset} from "../types/related.types.ts";
import {format} from "date-fns";


export function toTitleCase(input: string): string {
    return input
        .split("_") // tách theo dấu gạch dưới
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

const safeFormatDate = (dateValue: any, formatString: string): string | undefined => {
    if (!dateValue) return undefined;
    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return undefined;
        return format(date, formatString);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return undefined;
    }
};

function formatPlaceOfBirth(data: any): string {
    const { city_of_birth, province_of_birth, country_of_birth } = data;

    if (!country_of_birth && !province_of_birth && !city_of_birth) {
        return '';
    }

    // Nếu có cả city + province + country
    if (city_of_birth && province_of_birth && country_of_birth) {
        return `${city_of_birth} (${province_of_birth}), ${country_of_birth}`;
    }

    // Nếu có city + country (không có province)
    if (city_of_birth && country_of_birth) {
        return `${city_of_birth}, ${country_of_birth}`;
    }

    // Nếu chỉ có province + country
    if (province_of_birth && country_of_birth) {
        return `${province_of_birth}, ${country_of_birth}`;
    }

    // Nếu chỉ có country
    if (country_of_birth) {
        return country_of_birth;
    }

    // Nếu chỉ có city (rất hiếm khi không có country/province)
    if (city_of_birth) {
        return city_of_birth;
    }

    return '';
}

export function reformatEntity(data: Entity): Entity {
    const result: any = {
        ...data,
        source_system: data.source_system ? toTitleCase(data.source_system) : data.source_system,
        dbt_data: safeFormatDate(data.dbt_data, "yyyy-MM-dd HH:mm:ss") || data.dbt_data,
        created_date: safeFormatDate(data.created_date, "yyyy-MM-dd HH:mm:ss") || data.created_date,
        modified_date: safeFormatDate(data.modified_date, "yyyy-MM-dd HH:mm:ss") || data.modified_date,
        extracted_date: safeFormatDate(data.extracted_date, "yyyy-MM-dd HH:mm:ss") || data.extracted_date,
        source_details: data.source_details ? toTitleCase(data.source_details) : data.source_details,
        place_of_birth: formatPlaceOfBirth(data) || data.place_of_birth,
        file: data.file ? toTitleCase(data.file) : undefined,
        sheet: data.sheet ? toTitleCase(data.sheet) : undefined,
        unique_loan_id: toTitleCase(data.unique_loan_id),
    };

    // Chỉ format date_of_birth nếu có
    if (data.date_of_birth) {
        result.date_of_birth = safeFormatDate(data.date_of_birth, "yyyy-MM-dd") || data.date_of_birth;
    }

    // Chỉ format date_of_death nếu có
    if (data.date_of_death) {
        result.date_of_death = safeFormatDate(data.date_of_death, "yyyy-MM-dd") || data.date_of_death;
    }

    return result;
}

export function reformatAddress(data: Address): Address {
    return {
        ...data,
        source_system: data.source_system ? toTitleCase(data.source_system) : data.source_system,
        file: data.file ? toTitleCase(data.file).replace(".xlsx", "") : undefined,
        sheet: data.sheet ? toTitleCase(data.sheet) : undefined,
        address_category: data.address_category ? toTitleCase(data.address_category) : data.address_category,
        created_date: safeFormatDate(data.created_date, "yyyy-MM-dd HH:mm:ss") || data.created_date,
        modified_date: safeFormatDate(data.modified_date, "yyyy-MM-dd HH:mm:ss") || data.modified_date,
        extracted_date: safeFormatDate(data.extracted_date, "yyyy-MM-dd HH:mm:ss") || data.extracted_date,
    };
}

export function reformatContact(data: Contact): Contact {
    return {
        ...data,
        source_system: data.source_system ? toTitleCase(data.source_system) : data.source_system,
        file: data.file ? toTitleCase(data.file).replace(".xlsx", "") : undefined,
        sheet: data.sheet ? toTitleCase(data.sheet) : undefined,
        created_date: safeFormatDate(data.created_date, "yyyy-MM-dd HH:mm:ss") || data.created_date,
        modified_date: safeFormatDate(data.modified_date, "yyyy-MM-dd HH:mm:ss") || data.modified_date,
        extracted_date: safeFormatDate(data.extracted_date, "yyyy-MM-dd HH:mm:ss") || data.extracted_date,
    };
}

export function reformatBank(data: Bank): Bank {
    return {
        ...data,
        source_system: data.source_system ? toTitleCase(data.source_system) : data.source_system,
        file: data.file ? toTitleCase(data.file).replace(".xlsx", "") : undefined,
        sheet: data.sheet ? toTitleCase(data.sheet) : undefined,
        created_date: safeFormatDate(data.created_date, "yyyy-MM-dd HH:mm:ss") || data.created_date,
        modified_date: safeFormatDate(data.modified_date, "yyyy-MM-dd HH:mm:ss") || data.modified_date,
        extracted_date: safeFormatDate(data.extracted_date, "yyyy-MM-dd HH:mm:ss") || data.extracted_date,
    };
}

export function reformatJob(data: Job): Job {
    return {
        ...data,
        source_system: data.source_system ? toTitleCase(data.source_system) : data.source_system,
        file: data.file ? toTitleCase(data.file).replace(".xlsx", "") : undefined,
        sheet: data.sheet ? toTitleCase(data.sheet) : undefined,
        created_date: safeFormatDate(data.created_date, "yyyy-MM-dd HH:mm:ss") || data.created_date,
        modified_date: safeFormatDate(data.modified_date, "yyyy-MM-dd HH:mm:ss") || data.modified_date,
        extracted_date: safeFormatDate(data.extracted_date, "yyyy-MM-dd HH:mm:ss") || data.extracted_date,
    };
}

export function reformatAsset(data: Asset): Asset {
    return {
        ...data,
        source_system: data.source_system ? toTitleCase(data.source_system) : data.source_system,
        file: data.file ? toTitleCase(data.file).replace(".xlsx", "") : undefined,
        sheet: data.sheet ? toTitleCase(data.sheet) : undefined,
        address_category: data.address_category ? toTitleCase(data.address_category) : data.address_category,
        asset_category: data.asset_category ? toTitleCase(data.asset_category) : data.asset_category,
        created_date: safeFormatDate(data.created_date, "yyyy-MM-dd HH:mm:ss") || data.created_date,
        modified_date: safeFormatDate(data.modified_date, "yyyy-MM-dd HH:mm:ss") || data.modified_date,
        extracted_date: safeFormatDate(data.extracted_date, "yyyy-MM-dd HH:mm:ss") || data.extracted_date,
    };
}