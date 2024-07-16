'use client';
import usePaginationStore from '@/hooks/usePageinationStore';
import { Pagination } from '@nextui-org/react'
import clsx from 'clsx';
import React, { useEffect, useState } from 'react'

export default function PaginationComponent() {
    const totalCount = 1;
    const {setPage, setPageSize, setPagination, pagination} = usePaginationStore(state => ({
        setPage: state.setPage,
        setPageSize: state.setPageSize,
        setPagination:state.setPagination,
        pagination: state.pagination
    }));

    const {pageNumber, pageSize, totalPages} = pagination;

    const start = (pageNumber - 1) * pageSize + 1;
    const end = Math.min(pageNumber * pageSize);
    const resultText = `Showing ${start}-${end} of ${totalCount} results`

    useEffect(() => {
        setPagination
    }, [setPagination]);

  return (
    <div className="border-t-2 w-full mt-5">
        <div className="flex flex-row justify-between items-center py-5">
            <div>Showing 1-10 of 23 results</div>
            <Pagination 
                total={totalPages}
                color='secondary'
                page={pageNumber}
                variant='bordered'
                onChange={setPage}
            />
            <div className="flex flex-row gap-1 items-center">
                Page size:
                {[3,6,12].map(size => (
                    <div onClick={() => setPageSize(size)} key={size} className={clsx('page-size-box', {
                        'bg-secondary text-white hover:bg-secondary hover:text-white': pageSize === size
                    })}>
                        {size}
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}
