'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { MemberManagementTable, type Member, authController, authStateInstance } from '../../../features/auth';
import { Users } from 'lucide-react';

export default function MembersSettingsPage() {
  const state = useSyncExternalStore(
    (callback) => authStateInstance.subscribe(callback),
    () => authStateInstance.getSnapshot(),
    () => authStateInstance.getSnapshot()
  );

  useEffect(() => {
    authController.loadMembers();
  }, []);

  const displayMembers: readonly Member[] = state.members.length > 0
    ? state.members.map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        role: m.role || 'member',
        blocked: m.status === 'blocked',
      }))
    : [
        {
          id: state.user?.id || 'usr-current',
          name: state.user?.name || 'Admin User',
          email: state.user?.email || 'user@observability.io',
          role: (state.user?.role as any) || 'owner',
          blocked: false,
        },
      ];

  return (
    <div className="space-y-6 w-full text-left max-w-7xl mx-auto">
      <div className="flex items-center gap-3 pb-4 border-b border-[hsl(var(--border))]">
        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[hsl(var(--primary)/.15)] text-[hsl(var(--primary))] shrink-0">
          <Users size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">Member Management</h1>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
            Invite team members, assign RBAC roles (owner, admin, member, viewer), and manage organization permissions.
          </p>
        </div>
      </div>

      <MemberManagementTable members={displayMembers} />
    </div>
  );
}
