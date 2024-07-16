'use client';
import { useFilters } from '@/hooks/useFilters';
import { Button, Select, SelectItem, Slider, Spinner } from '@nextui-org/react';

export default function Filters() {    
    const {orderByList, genderList, filters, selectAge, selectOrder, selectedGender, isPending} = useFilters();
  return (
    <div className="shadow-md py-2">
        <div className="flex flex-row justify-around items-center">
            <div className='flex gap-2 items-center'>
                <div className="text-secondary font-semibold text-xl">
                    Results: 10
                </div>
                {isPending && <Spinner size='sm' color='secondary'/>}
            </div>
            <div className='flex gap-2 items-center'>
                <div>Gender:</div>
                {genderList.map(({icon:Icon, value}) => (
                    <Button 
                        key={value} 
                        size='sm' 
                        isIconOnly 
                        color={filters.gender.includes(value)?'secondary' : 'default'}
                        onClick={() => selectedGender(value)}
                    >
                        <Icon size ={24} />
                    </Button>
                ))}
            </div>
            <div className="flex flex-row items-center gap-2 w-1/4">
            <Slider 
               label='Age range'
               color='secondary'
               size='sm'
               minValue={18}
               maxValue={100}
               defaultValue={filters.ageRange} 
               onChangeEnd={(value) => selectAge(value as number[])}
            />
            </div>
            <div className="w-1/4">
                <Select 
                    size='sm'
                    fullWidth
                    label='Order by'
                    variant='bordered'
                    color='secondary'
                    aria-label='Order By'
                    selectedKeys={new Set([filters.orderBy])}
                    onSelectionChange={selectOrder}
                >
                    {orderByList.map(item => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </Select>
            </div>
        </div>
    </div>
  )
}
