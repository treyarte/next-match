import { auth } from '@/auth';
import ClientSession from '@/components/ClientSession';
import React from 'react'

export default async function page() {
    const session = await auth();
    return (
      <div className="flex flex-row justify-around mt-20 gap-6">
        <div className="bg-green-50 p-10 rounded-xl shadow-md w-1/2 overflow-auto">
        <h3 className="text-2xl font-semibold">Server Session Data:</h3>
        {session && (
          <div>
            <pre>{JSON.stringify(session,null, 2)}</pre>
          </div>
        )}
        </div>
        <ClientSession />
      </div>
    )
}
