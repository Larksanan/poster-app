'use client';
import React, { useEffect, useState } from 'react';
import { auth, googleProvider, githubProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User, AuthProvider } from 'firebase/auth';
import Image from 'next/image';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  async function signInWithProvider(provider: AuthProvider) {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      // minimal error feedback
      console.error(e);
      alert('Sign-in failed');
    }
  }

  async function signOutUser() {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {user ? (
        <div className="flex items-center gap-3">
          <Image
            src={user.photoURL ?? '/Logo.jpg'}
            alt="avatar"
            className="h-10 w-10 rounded-full object-cover"
            width={40}
            height={40}
          />
          <div>
            <div className="font-medium">{user.displayName}</div>
            <div className="text-sm text-zinc-500">{user.email}</div>
          </div>
          <button onClick={signOutUser} className="ml-4 rounded bg-red-600 px-3 py-1 text-white">
            Sign out
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button onClick={() => signInWithProvider(googleProvider)} className="rounded bg-blue-600 px-3 py-1 text-white">
            Sign in with Google
          </button>
          <button onClick={() => signInWithProvider(githubProvider)} className="rounded bg-gray-800 px-3 py-1 text-white">
            Sign in with GitHub
          </button>
        </div>
      )}
    </div>
  );
}
