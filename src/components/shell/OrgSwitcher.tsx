'use client';

import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { SearchableDropdown, type DropdownItem } from '../ui/SearchableDropdown';

export function OrgSwitcher() {
  const [activeOrgId, setActiveOrgId] = useState('org-scaibu');
  const userOrganizations = [
    { id: 'org-scaibu', name: 'Scaibu Inc.' },
    { id: 'org-staging', name: 'Staging Environment' },
  ];

  const handleSwitch = (orgId: string) => {
    if (orgId && orgId !== activeOrgId) {
      setActiveOrgId(orgId);
    }
  };


  const orgItems: DropdownItem[] = userOrganizations.length > 0
    ? userOrganizations.map((o: any) => ({
        id: o.id,
        label: o.name,
        description: `Workspace ID: ${o.id}`,
        icon: <Building2 className="h-4 w-4" />,
        value: o.id,
      }))
    : [
        {
          id: authUser?.org_id || 'org_default',
          label: authUser?.org_name || 'Active Workspace',
          description: 'Primary Workspace',
          icon: <Building2 className="h-4 w-4" />,
          value: authUser?.org_id || 'org_default',
        },
      ];

  return (
    <div className="w-full">
      <SearchableDropdown
        items={orgItems}
        value={activeOrgId}
        onChange={handleSwitch}
        placeholder="Search organization workspace..."
      />
    </div>
  );
}
