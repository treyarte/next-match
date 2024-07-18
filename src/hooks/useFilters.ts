import { Selection } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { FaFemale, FaMale } from "react-icons/fa";
import useFiltersStore from "./useFilterStore";
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

    const {gender, ageRange, orderBy, withPhoto} = filters;

    useEffect(() => {
        if(gender || ageRange || orderBy || withPhoto) {
            setPage(1);
        }
    }, [ageRange, gender, orderBy, setPage, withPhoto])

    useEffect(() => {
        startTransition(() => {
            const searchParams = new URLSearchParams();
            if(gender) searchParams.set('gender', gender.join(','));
            if(ageRange) searchParams.set('ageRange', ageRange.toString());
            if(orderBy) searchParams.set('orderBy', orderBy);
            if(pageSize) searchParams.set('pageSize' , pageSize.toString());
            if(pageNumber) searchParams.set('pageNumber' , pageNumber.toString());
            if(withPhoto) searchParams.set('withPhoto', withPhoto);

            router.replace(`${pathname}?${searchParams}`);
        })
    }, [ageRange, gender, orderBy, pageNumber, pageSize, pathname, router, withPhoto]);

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

    const handleWithPhotoSelect = (value:string) => {
        setFilters('withPhoto', value);
    }

    return {
        orderByList,
        genderList,
        selectAge:handleAgeSelect,
        selectedGender:handleGenderSelect,
        selectOrder:handleOrderSelect,
        selectWithPhoto:handleWithPhotoSelect,
        filters,
        isPending

    }
}