import { Spinner } from '@nextui-org/react'
import React from 'react'

export default function LoadingComponent({label}: {label?:string}) {
  return (
    <div className="vertical-center flex justify-center items-center">
      <Spinner 
        label={label || "Loading..."}
        color='secondary'
        labelColor='secondary'
      />
    </div>
  )
}
