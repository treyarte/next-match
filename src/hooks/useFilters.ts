import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaMale, FaFemale } from "react-icons/fa";
import useFiltersStore from "./useFilterStore";
import { useEffect } from "react";
import { Selection } from "@nextui-org/react";

export const useFilters = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const {filters, setFilters} = useFiltersStore();

    const {gender, ageRange, orderBy} = filters;

    useEffect(() => {
        const searchParams = new URLSearchParams();
        if(gender) searchParams.set('gender', gender.join(','));
        if(ageRange) searchParams.set('ageRange', ageRange.toString());
        if(orderBy) searchParams.set('orderBy', orderBy);

        router.replace(`${pathname}?${searchParams}`);
    }, [ageRange, gender, orderBy, pathname, router]);

    const orderByList = [
        {label:'Last Active', value: 'updated'},
        {label:'Newest Members', value: 'created'},
    ]

    const genderList = [
        {value: 'male', icon: FaMale},
        {value: 'female', icon: FaFemale},
    ]

    const handleAgeSelect = (value:number[]) => {
        setFilters('ageRange', value);
        
    }
    
    const handleOrderSelect = (value:Selection) => {
        if(value instanceof Set) {
            setFilters('orderBy', value.values().next().value);          
        }
    }
    
    const handleGenderSelect = (value:string) => {
        if(gender.includes(value)) setFilters('gender', gender.filter(g => g !== value));
        else setFilters('gender', [...gender, value]);
    }

    return {
        orderByList,
        genderList,
        selectAge:handleAgeSelect,
        selectedGender:handleGenderSelect,
        selectOrder:handleOrderSelect,
        filters
    }
}