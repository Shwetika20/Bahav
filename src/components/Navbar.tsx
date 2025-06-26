'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import {User} from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {
    const {data: session} = useSession()
    const user: User = session?.user as User

  return (
    <nav className='p-4 md:p-6 shadow-md'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <a href="#" className="flex flex-col md:flex-row items-start md:items-center">
                <span className="text-4xl font-bold leading-none">BAHAV</span>
                <span className="text-xl text-muted-foreground md:ml-2">  -  Voices for JAL</span>
            </a>

            {
                session ? (
                   <>
                   <span className='mr-4'>Welcome, {user?.username || user?.email}</span> 
                   <Button className='w-full md:w-auto' onClick={() => signOut({ callbackUrl: '/' })} // Redirects to homepage after logout
                   >Logout</Button>
                   </>
                ) : (
                    <Link href='/sign-in'>
                        <Button className='w-full md:w-auto'>Community Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar


