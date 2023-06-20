'use client';
import { useState } from 'react';
import Auth from './Auth';
import { auth } from "../utils/firebase/config";
import { useUserContext } from '../context/user';
import { signOut } from "firebase/auth";

export default function Header() {
    const { user, setUser } = useUserContext();
    const [ showModal, setShowModal ] = useState(false);
    const [ modalType, setModalType ] = useState('');

    const closeModal = () => {
        setShowModal(false);
    }

    const showCorrectModal = (type: string) => {
        setModalType(type);
        setShowModal(true);
    }

    const logOut = () => {
        signOut(auth);
        setUser('');
    }

	return (
        <>
            <header className="shadow-md bg-white flex flex-center">
                <div className="flex items-center justify-between container max-w-8xl py-5">
                    <h1 className="text-2xl">Fampicks</h1>
                    {!user && <div>
                        <button className="bg-white border text-slate-400 px-4 py-2 rounded-full mr-4" onClick={() => showCorrectModal('signIn')}>Sign in</button>
                        <button className="bg-teal-600 text-white px-4 py-2 rounded-full" onClick={() => showCorrectModal('signUp')}>Sign up</button>
                    </div>}
                    {user && <div className="flex items-center">
                        <div>{user}</div>
                        <button className="bg-white border text-slate-400 px-4 py-2 rounded-full ml-4" onClick={() => logOut()}>Sign Out</button>
                    </div>
                    }
                </div>
            </header>
            {showModal && <Auth type={modalType} onClose={closeModal} />}
        </>
	)
}
