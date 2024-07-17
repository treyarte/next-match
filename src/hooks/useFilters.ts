import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaMale, FaFemale } from "react-icons/fa";
import useFiltersStore from "./useFilterStore";
import { useEffect, useTransition } from "react";
import { Selection } from "@nextui-org/react";
import usePaginationStore from "./usePageinationStore";

export const useFilters = () => {
    const pathname = usePathname();
    
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    
    const {filters, setFilters} = useFiltersStore();
    const {pageNumber, pageSize, setPage, totalCount} = usePaginationStore(state => ({
        pageNumber:state.pagination.pageNumber,
        pageSize:state.pagination.pageSize,
        setPage:state.setPage,
        totalCount:state.pagination.totalCount,
    }))

    const {gender, ageRange, orderBy} = filters;

    useEffect(() => {
        if(gender || ageRange || orderBy) {
            setPage(1);
        }
    }, [ageRange, gender, orderBy, setPage])

    useEffect(() => {
        startTransition(() => {
            const searchParams = new URLSearchParams();
            if(gender) searchParams.set('gender', gender.join(','));
            if(ageRange) searchParams.set('ageRange', ageRange.toString());
            if(orderBy) searchParams.set('orderBy', orderBy);
            if(pageSize) searchParams.set('pageSize' , pageSize.toString());
            if(pageNumber) searchParams.set('pageNumber' , pageNumber.toString());

            router.replace(`${pathname}?${searchParams}`);
        })
    }, [ageRange, gender, orderBy, pageNumber, pageSize, pathname, router]);

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
        filters,
        isPending

    }
}