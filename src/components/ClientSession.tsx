'use client';
import { useSession } from 'next-auth/react'
import React from 'react'

export default function ClientSession() {
    const session = useSession();
  return (
    
        <div className="bg-blue-50 p-10 rounded-xl shadow-md w-1/2 overflow-auto">
            <h3 className="text-2xl font-semibold">Client Session Data:</h3>
            {session && (
                <div>
                    <pre>{JSON.stringify(session,null, 2)}</pre>
                </div>
            )}
        </div>
    
  )
}
