'use client';

import React from 'react';
import { ChatList } from '@/modules/support';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { redirect } from 'next/navigation';

export default function ChatPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || !user) {
    redirect('/auth/user/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            Communicate with vendors and other users
          </p>
        </div>
        
        <ChatList 
          currentUserId={parseInt(user.id)} 
          currentUserName={user.name} 
        />
      </div>
    </div>
  );
}
