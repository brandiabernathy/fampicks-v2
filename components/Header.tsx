'use client';
import { useState } from 'react';
import Auth from './Auth';

export default function Header() {
    const [ showModal, setShowModal ] = useState(false);

	return (
        <>
            <header className="shadow-md bg-white flex flex-center">
                <div className="flex items-center justify-between container max-w-8xl py-5">
                    <h1 className="text-2xl">Fampicks</h1>
                    <button className="bg-teal-600 text-white px-4 py-2 rounded-full" onClick={() => setShowModal(true)}>Sign in</button>
                </div>
            </header>
            {showModal && <Auth />}
        </>
	)
}
